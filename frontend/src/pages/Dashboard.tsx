import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { novelService } from '../services/novelService';
import { Novel } from '../types';

const Dashboard: React.FC = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadNovels();
  }, []);

  const loadNovels = async () => {
    setLoading(true);
    try {
      const data = await novelService.getNovels();
      setNovels(data.novels);
    } catch (err: any) {
      setError(err.response?.data?.error || '소설 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewNovel = (novelId: number) => {
    navigate(`/novels/${novelId}`);
  };

  const handleUploadStory = () => {
    navigate('/upload');
  };

  const handleEditNovel = (novel: Novel) => {
    setEditingNovel(novel);
    setEditTitle(novel.title);
    setEditDescription(novel.description || '');
  };

  const handleCancelEdit = () => {
    setEditingNovel(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editingNovel) return;
    
    try {
      await novelService.updateNovel(editingNovel.id, editTitle, editDescription);
      await loadNovels();
      handleCancelEdit();
    } catch (err: any) {
      alert(err.response?.data?.error || '소설 수정에 실패했습니다');
    }
  };

  const handleDeleteNovel = async (novelId: number, novelTitle: string) => {
    if (!window.confirm(`"${novelTitle}" 소설을 삭제하시겠습니까? 모든 챕터와 리뷰가 삭제됩니다.`)) {
      return;
    }

    try {
      await novelService.deleteNovel(novelId);
      await loadNovels();
    } catch (err: any) {
      alert(err.response?.data?.error || '소설 삭제에 실패했습니다');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>대시보드</h1>
          <p style={styles.welcome}>{user?.username}님, 환영합니다!</p>
        </div>
        <div style={styles.headerButtons}>
          <button onClick={handleUploadStory} style={styles.primaryButton}>
            + 새 챕터 작성
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            로그아웃
          </button>
        </div>
      </div>

      <div style={styles.statsCard}>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{novels.length}</div>
          <div style={styles.statLabel}>총 소설</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>
            {novels.reduce((sum, n) => sum + (n.chapter_count || 0), 0)}
          </div>
          <div style={styles.statLabel}>총 챕터</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>6</div>
          <div style={styles.statLabel}>AI 독자</div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingBox}>
          <p>로딩 중...</p>
        </div>
      ) : error ? (
        <div style={styles.errorBox}>
          <p>{error}</p>
        </div>
      ) : novels.length === 0 ? (
        <div style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>아직 작성한 소설이 없습니다</h2>
          <p style={styles.emptyText}>
            첫 번째 소설을 작성하고 AI 독자들의 피드백을 받아보세요!
          </p>
          <button onClick={handleUploadStory} style={styles.primaryButton}>
            첫 소설 작성하기
          </button>
        </div>
      ) : (
        <div style={styles.novelsSection}>
          <h2 style={styles.sectionTitle}>내 소설 ({novels.length})</h2>
          <div style={styles.novelGrid}>
            {novels.map((novel) => (
              <div key={novel.id} style={styles.novelCard}>
                <h3 style={styles.novelTitle}>{novel.title}</h3>
                {novel.description && (
                  <p style={styles.novelDescription}>{novel.description}</p>
                )}
                <div style={styles.novelMeta}>
                  <span style={styles.metaItem}>
                    📚 {novel.chapter_count || 0} 챕터
                  </span>
                  <span style={styles.metaItem}>
                    📅 {new Date(novel.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div style={styles.cardActions}>
                  <button
                    onClick={() => handleViewNovel(novel.id)}
                    style={styles.viewButton}
                  >
                    상세보기
                  </button>
                  <button
                    onClick={() => navigate(`/upload?novelId=${novel.id}`)}
                    style={styles.addChapterButton}
                  >
                    챕터 추가
                  </button>
                  <button
                    onClick={() => handleEditNovel(novel)}
                    style={styles.editButton}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteNovel(novel.id, novel.title)}
                    style={styles.deleteButton}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingNovel && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>소설 수정</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>제목</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={styles.input}
                placeholder="소설 제목"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>설명</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={styles.textarea}
                placeholder="소설 설명"
                rows={4}
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
  title: {
    fontSize: '2.5rem',
    color: '#333',
    margin: 0,
  },
  welcome: {
    color: '#666',
    marginTop: '0.5rem',
  },
  headerButtons: {
    display: 'flex',
    gap: '1rem',
  },
  primaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  statsCard: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '0.5rem',
  },
  statLabel: {
    color: '#666',
    fontSize: '0.9rem',
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
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyTitle: {
    fontSize: '1.75rem',
    color: '#333',
    marginBottom: '1rem',
  },
  emptyText: {
    color: '#666',
    marginBottom: '2rem',
    fontSize: '1.1rem',
  },
  novelsSection: {
    marginTop: '2rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    color: '#333',
    marginBottom: '1.5rem',
  },
  novelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  novelCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  novelTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '0.75rem',
  },
  novelDescription: {
    color: '#666',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  novelMeta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #eee',
  },
  metaItem: {
    color: '#666',
    fontSize: '0.9rem',
  },
  cardActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  viewButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  addChapterButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  editButton: {
    padding: '0.75rem',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  deleteButton: {
    padding: '0.75rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
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
    maxWidth: '500px',
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

export default Dashboard;
