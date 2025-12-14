import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { novelService } from '../services/novelService';
import { Chapter, AIReview } from '../types';

const ChapterReviews: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [reviews, setReviews] = useState<AIReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadChapterAndReviews();
  }, [chapterId]);

  const loadChapterAndReviews = async () => {
    if (!chapterId) return;
    
    setLoading(true);
    try {
      const data = await novelService.getChapterWithReviews(parseInt(chapterId));
      setChapter(data.chapter);
      setReviews(data.reviews);
    } catch (err: any) {
      setError(err.response?.data?.error || '챕터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const getPersonaEmoji = (personaType: string) => {
    const emojiMap: { [key: string]: string } = {
      'casual-reader': '📖',
      'literary-critic': '🎓',
      'genre-enthusiast': '⭐',
      'editor': '✏️',
      'commercial-publisher': '💼',
      'fellow-writer': '🤝',
    };
    return emojiMap[personaType] || '💬';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#28a745';
    if (rating >= 6) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <h2>로딩 중...</h2>
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>오류</h2>
          <p>{error || '챕터를 찾을 수 없습니다'}</p>
          <button onClick={() => navigate('/dashboard')} style={styles.button}>
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← 대시보드
        </button>
        <div style={styles.ratingBadge}>
          평균 평점: {averageRating} / 10
        </div>
      </div>

      <div style={styles.chapterCard}>
        <div style={styles.chapterHeader}>
          <h1 style={styles.chapterTitle}>
            챕터 {chapter.chapter_number}: {chapter.title}
          </h1>
          <div style={styles.chapterMeta}>
            글자 수: {chapter.word_count}자
          </div>
        </div>
        <div style={styles.chapterContent}>
          {chapter.content.split('\n').map((paragraph, idx) => (
            <p key={idx} style={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div style={styles.reviewsSection}>
        <h2 style={styles.reviewsTitle}>
          AI 독자 리뷰 ({reviews.length}개)
        </h2>
        
        {reviews.length === 0 ? (
          <div style={styles.noReviews}>
            <p>아직 리뷰가 생성되지 않았습니다.</p>
          </div>
        ) : (
          <div style={styles.reviewGrid}>
            {reviews.map((review) => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.personaInfo}>
                    <span style={styles.personaEmoji}>
                      {getPersonaEmoji(review.persona_type)}
                    </span>
                    <span style={styles.personaName}>{review.persona_name}</span>
                  </div>
                  <div
                    style={{
                      ...styles.ratingBadge,
                      backgroundColor: getRatingColor(review.rating),
                    }}
                  >
                    {review.rating} / 10
                  </div>
                </div>
                <div style={styles.reviewContent}>
                  {review.review_text.split('\n').map((line, idx) => (
                    <p key={idx} style={styles.reviewParagraph}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  ratingBadge: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '20px',
    fontWeight: 'bold',
  },
  chapterCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  chapterHeader: {
    borderBottom: '2px solid #eee',
    paddingBottom: '1rem',
    marginBottom: '2rem',
  },
  chapterTitle: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  chapterMeta: {
    color: '#666',
    fontSize: '0.9rem',
  },
  chapterContent: {
    lineHeight: '1.8',
    color: '#444',
  },
  paragraph: {
    marginBottom: '1rem',
  },
  reviewsSection: {
    marginTop: '3rem',
  },
  reviewsTitle: {
    fontSize: '1.75rem',
    color: '#333',
    marginBottom: '1.5rem',
  },
  reviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '1.5rem',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #eee',
  },
  personaInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  personaEmoji: {
    fontSize: '1.5rem',
  },
  personaName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
  },
  reviewContent: {
    color: '#555',
    lineHeight: '1.6',
  },
  reviewParagraph: {
    marginBottom: '0.75rem',
  },
  loadingBox: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  errorBox: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  noReviews: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#666',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  },
};

export default ChapterReviews;
