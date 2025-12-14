import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { novelService } from '../services/novelService';
import { Novel, Chapter } from '../types';

const NovelDetail: React.FC = () => {
  const { novelId } = useParams<{ novelId: string }>();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadNovel();
  }, [novelId]);

  const loadNovel = async () => {
    if (!novelId) return;
    
    setLoading(true);
    try {
      const data = await novelService.getNovelById(parseInt(novelId));
      setNovel(data.novel);
      setChapters(data.chapters);
    } catch (err: any) {
      setError(err.response?.data?.error || '소설을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChapter = async (chapter: Chapter) => {
    setEditingChapter(chapter);
    setEditTitle(chapter.title);
    setEditContent(chapter.content);
  };

  const handleCancelEdit = () => {
    setEditingChapter(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!editingChapter) return;
    
    try {
      await novelService.updateChapter(editingChapter.id, editTitle, editContent);
      await loadNovel();
      handleCancelEdit();
    } catch (err: any) {
      alert(err.response?.data?.error || '챕터 수정에 실패했습니다');
    }
  };

  const handleDeleteChapter = async (chapterId: number, chapterTitle: string) => {
    if (!window.confirm(`"${chapterTitle}" 챕터를 삭제하시겠습니까? 모든 리뷰가 삭제됩니다.`)) {
      return;
    }

    try {
      await novelService.deleteChapter(chapterId);
      await loadNovel();
    } catch (err: any) {
      alert(err.response?.data?.error || '챕터 삭제에 실패했습니다');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>로딩 중...</div>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <p>{error || '소설을 찾을 수 없습니다'}</p>
          <button onClick={() => navigate('/dashboard')} style={styles.button}>
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← 대시보드
        </button>
        <button
          onClick={() => navigate(`/upload?novelId=${novelId}`)}
          style={styles.addButton}
        >
          + 챕터 추가
        </button>
      </div>

      <div style={styles.novelCard}>
        <h1 style={styles.title}>{novel.title}</h1>
        {novel.description && <p style={styles.description}>{novel.description}</p>}
        <div style={styles.meta}>
          <span>총 {chapters.length}개 챕터</span>
          <span>생성일: {new Date(novel.created_at).toLocaleDateString('ko-KR')}</span>
        </div>
      </div>

      <div style={styles.chaptersSection}>
        <h2 style={styles.sectionTitle}>챕터 목록</h2>
        {chapters.length === 0 ? (
          <div style={styles.emptyState}>
            <p>아직 작성된 챕터가 없습니다.</p>
            <button
              onClick={() => navigate(`/upload?novelId=${novelId}`)}
              style={styles.button}
            >
              첫 챕터 작성하기
            </button>
          </div>
        ) : (
          <div style={styles.chapterList}>
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                style={styles.chapterItem}
              >
                <div style={styles.chapterInfo}>
                  <h3 style={styles.chapterTitle}>
                    챕터 {chapter.chapter_number}: {chapter.title}
                  </h3>
                  <p style={styles.chapterMeta}>
                    {chapter.word_count}자 · {new Date(chapter.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div style={styles.chapterActions}>
                  <button 
                    onClick={() => navigate(`/chapters/${chapter.id}`)}
                    style={styles.viewButton}
                  >
                    리뷰 보기
                  </button>
                  <button 
                    onClick={() => handleEditChapter(chapter)}
                    style={styles.editButton}
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                    style={styles.deleteButton}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingChapter && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>챕터 수정</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>제목</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={styles.input}
                placeholder="챕터 제목"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>내용</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={styles.textarea}
                placeholder="챕터 내용"
                rows={15}
              />
            </div>
            <div style={styles.modalActions}>
              <button onClick={handleSaveEdit} style={styles.saveButton}>
                저장
              </button>
              <button onClick={handleCancelEdit} style={styles.cancelButton}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  novelCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '1rem',
  },
  description: {
    color: '#666',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  meta: {
    display: 'flex',
    gap: '2rem',
    color: '#888',
    fontSize: '0.9rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
  },
  chaptersSection: {
    marginTop: '2rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    color: '#333',
    marginBottom: '1.5rem',
  },
  chapterList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  chapterItem: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: '1.25rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  chapterMeta: {
    color: '#666',
    fontSize: '0.9rem',
  },
  chapterActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  viewButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
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
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
    color: '#333',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#333',
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
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  saveButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default NovelDetail;
