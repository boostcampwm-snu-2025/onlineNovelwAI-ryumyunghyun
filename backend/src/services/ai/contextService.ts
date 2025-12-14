import db from '../../config/database';

export interface Persona {
  id: number;
  name: string;
  type: string;
  description: string;
  evaluation_criteria: string;
  tone: string;
}

export interface PreviousChapter {
  chapterNumber: number;
  title: string;
  content: string;
}

export async function getAllPersonas(): Promise<Persona[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM personas', (err, rows: Persona[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export async function getPreviousChapters(novelId: number, currentChapterNumber: number): Promise<PreviousChapter[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT chapter_number as chapterNumber, title, content 
       FROM chapters 
       WHERE novel_id = ? AND chapter_number < ? 
       ORDER BY chapter_number ASC`,
      [novelId, currentChapterNumber],
      (err, rows: PreviousChapter[]) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}
