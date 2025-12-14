import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { novelService } from '../services/novelService';
import { Novel } from '../types';

const UploadStory: React.FC = () => {
  const { novelId } = useParams<{ novelId: string }>();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovelId, setSelectedNovelId] = useState<string>(novelId || '');
  const [showNewNovel, setShowNewNovel] = useState(false);
  
  // New novel fields
  const [novelTitle, setNovelTitle] = useState('');
  const [novelDescription, setNovelDescription] = useState('');
  
  // Chapter fields
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadNovels();
  }, []);

  const loadNovels = async () => {
    try {
      const data = await novelService.getNovels();
      setNovels(data.novels);
    } catch (err) {
      console.error('Failed to load novels', err);
    }
  };

  const handleCreateNovel = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await novelService.createNovel(novelTitle, novelDescription);
      setSelectedNovelId(result.novel.id);
      setShowNewNovel(false);
      setNovelTitle('');
      setNovelDescription('');
      await loadNovels();
      setSuccess('소설이 생성되었습니다!');
    } catch (err: any) {
      setError(err.response?.data?.error || '소설 생성에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedNovelId) {
      setError('소설을 선택해주세요');
      return;
    }

    setLoading(true);

    try {
      const result = await novelService.createChapter(
        parseInt(selectedNovelId),
        chapterNumber,
        chapterTitle,
        chapterContent
      );
      
      setSuccess('챕터가 업로드되었고 AI 리뷰가 생성되었습니다!');
      
      // Navigate to chapter reviews after a short delay
      setTimeout(() => {
        navigate(`/chapters/${result.chapter.id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || '챕터 업로드에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>챕터 업로드</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          대시보드로 돌아가기
        </button>
      </div>

      <div style={styles.card}>
        {!showNewNovel ? (
          <div style={styles.section}>
            <h2 style={styles.subtitle}>소설 선택</h2>
            <div style={styles.novelSelector}>
              <select
                value={selectedNovelId}
                onChange={(e) => setSelectedNovelId(e.target.value)}
                style={styles.select}
              >
                <option value="">소설을 선택하세요</option>
                {novels.map((novel) => (
                  <option key={novel.id} value={novel.id}>
                    {novel.title}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewNovel(true)}
                style={styles.secondaryButton}
              >
                새 소설 만들기
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.section}>
            <h2 style={styles.subtitle}>새 소설 만들기</h2>
            <form onSubmit={handleCreateNovel}>
              <div style={styles.formGroup}>
                <label style={styles.label}>소설 제목</label>
                <input
                  type="text"
                  value={novelTitle}
                  onChange={(e) => setNovelTitle(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="소설 제목을 입력하세요"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>소설 설명 (선택)</label>
                <textarea
                  value={novelDescription}
                  onChange={(e) => setNovelDescription(e.target.value)}
                  style={{...styles.textarea, height: '80px'}}
                  placeholder="소설에 대한 간단한 설명을 입력하세요"
                />
              </div>
              <div style={styles.buttonGroup}>
                <button type="submit" disabled={loading} style={styles.button}>
                  {loading ? '생성 중...' : '소설 생성'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewNovel(false)}
                  style={styles.cancelButton}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedNovelId && !showNewNovel && (
          <form onSubmit={handleUploadChapter} style={styles.section}>
            <h2 style={styles.subtitle}>챕터 정보</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>챕터 번호</label>
              <input
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(parseInt(e.target.value))}
                required
                min="1"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>챕터 제목</label>
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                required
                style={styles.input}
                placeholder="챕터 제목을 입력하세요"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>챕터 내용</label>
              <textarea
                value={chapterContent}
                onChange={(e) => setChapterContent(e.target.value)}
                required
                style={styles.textarea}
                placeholder="챕터 내용을 입력하세요..."
              />
              <small style={styles.hint}>
                글자 수: {chapterContent.length}자
              </small>
            </div>
            
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}
            
            {loading && (
              <div style={styles.loadingBox}>
                <p>AI 페르소나들이 리뷰를 작성하고 있습니다...</p>
                <p style={styles.loadingSubtext}>
                  6명의 AI 독자가 작품을 읽고 평가하는 중입니다. 잠시만 기다려주세요.
                </p>
              </div>
            )}
            
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? '업로드 및 AI 리뷰 생성 중...' : '챕터 업로드'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    margin: 0,
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  section: {
    marginBottom: '2rem',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#444',
    marginBottom: '1rem',
  },
  novelSelector: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  select: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '300px',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  hint: {
    color: '#666',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  button: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  secondaryButton: {
    padding: '0.75rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  cancelButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: '#dc3545',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f8d7da',
    borderRadius: '4px',
  },
  success: {
    color: '#28a745',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#d4edda',
    borderRadius: '4px',
  },
  loadingBox: {
    backgroundColor: '#e7f3ff',
    padding: '1.5rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
};

export default UploadStory;
