import { Response } from 'express';
import db from '../config/database';
import { AuthRequest } from '../middleware/auth'; // Import AuthRequest interface (with userId) extension of Express Request
import { getAllPersonas, getPreviousChapters } from '../services/ai/contextService';
import { generateReview } from '../services/ai/openaiService';

export const createNovel = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({ error: '소설 제목을 입력해주세요' });
    }

    db.run(
      'INSERT INTO novels (user_id, title, description) VALUES (?, ?, ?)',
      [userId, title, description || ''],
      function (err) {
        if (err) {
          return res.status(500).json({ error: '소설 생성 실패' });
        }

        res.status(201).json({
          message: '소설이 생성되었습니다',
          novel: { id: this.lastID, title, description }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};

export const getNovelsByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    db.all(
      `SELECT n.*, COUNT(c.id) as chapter_count
       FROM novels n
       LEFT JOIN chapters c ON n.id = c.novel_id
       WHERE n.user_id = ?
       GROUP BY n.id
       ORDER BY n.created_at DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: '소설 목록 조회 실패' });
        }
        res.json({ novels: rows });
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};

export const getNovelById = async (req: AuthRequest, res: Response) => {
  try {
    const novelId = req.params.id;
    const userId = req.userId;

    db.get(
      'SELECT * FROM novels WHERE id = ? AND user_id = ?',
      [novelId, userId],
      (err, novel) => {
        if (err) {
          return res.status(500).json({ error: '소설 조회 실패' });
        }
        if (!novel) {
          return res.status(404).json({ error: '소설을 찾을 수 없습니다' });
        }

        // Get chapters
        db.all(
          'SELECT * FROM chapters WHERE novel_id = ? ORDER BY chapter_number ASC',
          [novelId],
          (err, chapters) => {
            if (err) {
              return res.status(500).json({ error: '챕터 조회 실패' });
            }
            res.json({ novel, chapters });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};

export const createChapter = async (req: AuthRequest, res: Response) => {
  try {
    const { novelId, chapterNumber, title, content } = req.body;
    const userId = req.userId;

    if (!novelId || !chapterNumber || !title || !content) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요' });
    }

    // Verify novel ownership
    db.get(
      'SELECT * FROM novels WHERE id = ? AND user_id = ?',
      [novelId, userId],
      async (err, novel) => {
        if (err || !novel) {
          return res.status(404).json({ error: '소설을 찾을 수 없습니다' });
        }

        const wordCount = content.length;

        // Insert chapter
        db.run(
          'INSERT INTO chapters (novel_id, chapter_number, title, content, word_count) VALUES (?, ?, ?, ?, ?)',
          [novelId, chapterNumber, title, content, wordCount],
          async function (err) {
            if (err) {
              if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: '해당 챕터 번호가 이미 존재합니다' });
              }
              return res.status(500).json({ error: '챕터 생성 실패' });
            }

            const chapterId = this.lastID;

            // Generate AI reviews for all personas
            try {
              const personas = await getAllPersonas();
              const previousChapters = await getPreviousChapters(novelId, chapterNumber);

              // Generate reviews from all 6 personas
              const reviewPromises = personas.map(async (persona) => {
                const review = await generateReview({
                  chapterContent: content,
                  chapterNumber,
                  chapterTitle: title,
                  previousChapters,
                  personaType: persona.type,
                  personaName: persona.name
                });

                return new Promise((resolve, reject) => {
                  db.run(
                    'INSERT INTO ai_reviews (chapter_id, persona_id, review_text, rating) VALUES (?, ?, ?, ?)',
                    [chapterId, persona.id, review.reviewText, review.rating],
                    (err) => {
                      if (err) reject(err);
                      else resolve(true);
                    }
                  );
                });
              });

              await Promise.all(reviewPromises); // wait for all reviews to be inserted

              res.status(201).json({
                message: '챕터가 생성되고 AI 리뷰가 생성되었습니다',
                chapter: { id: chapterId, chapterNumber, title }
              });
            } catch (error) {
              console.error('AI Review Generation Error:', error);
              res.status(201).json({
                message: '챕터가 생성되었으나 AI 리뷰 생성에 실패했습니다',
                chapter: { id: chapterId, chapterNumber, title },
                warning: 'AI 리뷰 생성 실패'
              });
            }
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};

export const getChapterWithReviews = async (req: AuthRequest, res: Response) => {
  try {
    const chapterId = req.params.id;
    const userId = req.userId;

    // Get chapter with novel info
    db.get(
      `SELECT c.*, n.title as novel_title, n.user_id
       FROM chapters c
       JOIN novels n ON c.novel_id = n.id
       WHERE c.id = ? AND n.user_id = ?`,
      [chapterId, userId],
      (err, chapter: any) => {
        if (err) {
          return res.status(500).json({ error: '챕터 조회 실패' });
        }
        if (!chapter) {
          return res.status(404).json({ error: '챕터를 찾을 수 없습니다' });
        }

        // Get reviews
        db.all(
          `SELECT r.*, p.name as persona_name, p.type as persona_type
           FROM ai_reviews r
           JOIN personas p ON r.persona_id = p.id
           WHERE r.chapter_id = ?
           ORDER BY r.id ASC`,
          [chapterId],
          (err, reviews) => {
            if (err) {
              return res.status(500).json({ error: '리뷰 조회 실패' });
            }
            res.json({ chapter, reviews });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};

export const updateNovel = async (req: AuthRequest, res: Response) => {
  try {
    const novelId = req.params.id;
    const userId = req.userId;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: '소설 제목을 입력해주세요' });
    }

    db.run(
      'UPDATE novels SET title = ?, description = ? WHERE id = ? AND user_id = ?',
      [title, description || '', novelId, userId],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: '소설 수정 실패' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: '소설을 찾을 수 없거나 권한이 없습니다' });
        }

        res.json({
          message: '소설이 수정되었습니다',
          novel: { id: novelId, title, description }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};

export const deleteNovel = async (req: AuthRequest, res: Response) => {
  try {
    const novelId = req.params.id;
    const userId = req.userId;

    // Verify ownership before deletion
    db.get(
      'SELECT * FROM novels WHERE id = ? AND user_id = ?',
      [novelId, userId],
      (err, novel) => {
        if (err) {
          return res.status(500).json({ error: '소설 조회 실패' });
        }
        if (!novel) {
          return res.status(404).json({ error: '소설을 찾을 수 없거나 권한이 없습니다' });
        }

        // Delete novel (cascading will delete chapters and reviews)
        db.run(
          'DELETE FROM novels WHERE id = ?',
          [novelId],
          function (err) {
            if (err) {
              return res.status(500).json({ error: '소설 삭제 실패' });
            }

            res.json({ message: '소설이 삭제되었습니다' });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};

export const updateChapter = async (req: AuthRequest, res: Response) => {
  try {
    const chapterId = req.params.id;
    const userId = req.userId;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: '제목과 내용을 모두 입력해주세요' });
    }

    const wordCount = content.length;

    // Verify ownership through novel
    db.get(
      `SELECT c.*, n.user_id
       FROM chapters c
       JOIN novels n ON c.novel_id = n.id
       WHERE c.id = ? AND n.user_id = ?`,
      [chapterId, userId],
      (err, chapter: any) => {
        if (err) {
          return res.status(500).json({ error: '챕터 조회 실패' });
        }
        if (!chapter) {
          return res.status(404).json({ error: '챕터를 찾을 수 없거나 권한이 없습니다' });
        }

        // Update chapter
        db.run(
          'UPDATE chapters SET title = ?, content = ?, word_count = ? WHERE id = ?',
          [title, content, wordCount, chapterId],
          function (err) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: '챕터 수정 실패' });
            }

            res.json({
              message: '챕터가 수정되었습니다',
              chapter: { id: chapterId, title, wordCount }
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};

export const deleteChapter = async (req: AuthRequest, res: Response) => {
  try {
    const chapterId = req.params.id;
    const userId = req.userId;

    // Verify ownership through novel
    db.get(
      `SELECT c.*, n.user_id
       FROM chapters c
       JOIN novels n ON c.novel_id = n.id
       WHERE c.id = ? AND n.user_id = ?`,
      [chapterId, userId],
      (err, chapter: any) => {
        if (err) {
          return res.status(500).json({ error: '챕터 조회 실패' });
        }
        if (!chapter) {
          return res.status(404).json({ error: '챕터를 찾을 수 없거나 권한이 없습니다' });
        }

        // Delete chapter (cascading will delete reviews)
        db.run(
          'DELETE FROM chapters WHERE id = ?',
          [chapterId],
          function (err) {
            if (err) {
              return res.status(500).json({ error: '챕터 삭제 실패' });
            }

            res.json({ message: '챕터가 삭제되었습니다' });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
};
