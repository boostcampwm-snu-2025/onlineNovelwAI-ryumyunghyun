# 데이터 구조 (Data Structures)

모든 엔티티는 TypeScript 인터페이스로 정의되며, 프론트엔드와 백엔드 간 타입 안정성을 보장합니다.

---

## 1. User (사용자)

사용자 계정 및 프로필 정보

```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // 고유 이메일
  passwordHash: string;          // 해시된 비밀번호 (bcrypt)
  penName: string;               // 필명 (공개용 표시명)
  profileImage?: string;         // 프로필 이미지 URL
  createdAt: Date;               // 가입일
  updatedAt: Date;               // 마지막 수정일
  preferences: UserPreferences;  // 사용자 설정
  stats: UserStats;              // 통계 정보
}

interface UserPreferences {
  theme: 'light' | 'dark';       // UI 테마
  autoSave: boolean;             // 자동 저장 활성화
  autoSaveInterval: number;      // 자동 저장 간격 (초)
  defaultGenre?: string;         // 선호 장르
  notificationsEnabled: boolean; // 알림 활성화
  emailNotifications: boolean;   // 이메일 알림
}

interface UserStats {
  totalNovels: number;           // 총 생성한 소설 수
  totalChapters: number;         // 총 작성한 챕터 수
  totalWords: number;            // 총 단어 수
  writingStreak: number;         // 연속 작성 일수
  lastWriteDate: Date;           // 마지막 작성 날짜
  achievementsUnlocked: string[]; // 획득한 업적 ID 목록
  averageAIRating: number;       // 전체 평균 AI 평점
}
```

---

## 2. Novel (소설)

소설 프로젝트 메타데이터

```typescript
interface Novel {
  id: string;                    // UUID
  authorId: string;              // User ID (Foreign Key)
  title: string;                 // 소설 제목
  description: string;           // 줄거리/소개
  genre: NovelGenre;             // 장르
  coverImage?: string;           // 표지 이미지 URL
  status: NovelStatus;           // 작성 상태
  visibility: 'private' | 'public'; // 공개 여부
  tags: string[];                // 태그 목록
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 마지막 수정일
  metadata: NovelMetadata;       // 메타데이터
  chapters: Chapter[];           // 챕터 목록 (1:N 관계)
}

enum NovelGenre {
  FANTASY = 'fantasy',           // 판타지
  ROMANCE = 'romance',           // 로맨스
  MYSTERY = 'mystery',           // 미스터리
  SCIFI = 'scifi',               // SF
  THRILLER = 'thriller',         // 스릴러
  HORROR = 'horror',             // 호러
  LITERARY = 'literary',         // 순문학
  CONTEMPORARY = 'contemporary', // 현대물
  HISTORICAL = 'historical',     // 시대극/역사물
  ACTION = 'action',             // 액션
}

enum NovelStatus {
  DRAFT = 'draft',               // 초안
  IN_PROGRESS = 'in_progress',   // 작성 중
  COMPLETED = 'completed',       // 완결
  ABANDONED = 'abandoned',       // 중단
  ON_HIATUS = 'on_hiatus',       // 휴재
}

interface NovelMetadata {
  totalWords: number;            // 총 단어 수
  totalChapters: number;         // 총 챕터 수
  averageAIRating: number;       // 평균 AI 평점
  lastReviewDate?: Date;         // 마지막 리뷰 날짜
  completionPercentage: number;  // 완성도 (추정)
  targetWordCount?: number;      // 목표 단어 수
}
```

---

## 3. Chapter (챕터)

소설의 각 챕터

```typescript
interface Chapter {
  id: string;                    // UUID
  novelId: string;               // Novel ID (Foreign Key)
  chapterNumber: number;         // 챕터 번호
  title: string;                 // 챕터 제목
  content: string;               // 본문 내용 (Markdown/Plain text)
  wordCount: number;             // 단어 수
  status: ChapterStatus;         // 챕터 상태
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 마지막 수정일
  publishedAt?: Date;            // 공개일 (공개 소설인 경우)
  reviews: AIReview[];           // AI 리뷰 목록 (1:N 관계)
  notes?: string;                // 작가 메모
}

enum ChapterStatus {
  DRAFT = 'draft',               // 초안
  READY_FOR_REVIEW = 'ready_for_review', // 리뷰 준비 완료
  REVIEWED = 'reviewed',         // 리뷰 완료
  REVISED = 'revised',           // 수정됨
  PUBLISHED = 'published',       // 공개됨
}
```

---

## 4. AIPersona (AI 페르소나)

AI 리뷰어의 캐릭터 정의

```typescript
interface AIPersona {
  id: string;                    // UUID
  name: string;                  // 페르소나 이름
  type: PersonaType;             // 페르소나 유형
  description: string;           // 설명
  avatarImage: string;           // 아바타 이미지 URL
  systemPrompt: string;          // AI 시스템 프롬프트 (프롬프트 엔지니어링)
  traits: PersonaTrait[];        // 성격 특성
  rating: {
    minScore: number;            // 최소 점수
    maxScore: number;            // 최대 점수
  };
  isActive: boolean;             // 활성화 여부 (관리자)
  createdAt: Date;               // 생성일
  color: string;                 // UI 식별 색상 (hex)
}

enum PersonaType {
  CASUAL_READER = 'casual_reader',       // 캐주얼 독자
  LITERARY_CRITIC = 'literary_critic',   // 문학 평론가
  GENRE_ENTHUSIAST = 'genre_enthusiast', // 장르 팬
  EDITOR = 'editor',                     // 편집자
  PUBLISHER = 'publisher',               // 상업 출판인
  FELLOW_WRITER = 'fellow_writer',       // 창작 작가 동료
}

interface PersonaTrait {
  key: string;                   // 특성 키 (예: "strictness", "creativity")
  value: number;                 // 1-10 척도
  description: string;           // 특성 설명
}
```

---

## 5. AIReview (AI 리뷰)

AI가 생성한 챕터 리뷰

```typescript
interface AIReview {
  id: string;                    // UUID
  chapterId: string;             // Chapter ID (Foreign Key)
  personaId: string;             // AIPersona ID (Foreign Key)
  novelId: string;               // Novel ID (컨텍스트 쿼리용)
  overallRating: number;         // 종합 평점 (1-10)
  sentiment: 'positive' | 'neutral' | 'negative'; // 감정 분석
  reviewText: string;            // 종합 리뷰 텍스트
  strengths: string[];           // 장점 목록 (bullet points)
  improvements: string[];        // 개선점 제안 목록
  detailedScores: ReviewScores;  // 세부 평가 항목
  quotes: ReviewQuote[];         // 인용문과 코멘트
  contextAware: boolean;         // 이전 챕터 컨텍스트 사용 여부
  generatedAt: Date;             // 생성 시간
  aiModel: string;               // 사용된 AI 모델 (예: "gpt-4", "claude-3.5-sonnet")
  tokenUsage: number;            // 사용된 토큰 수
  metadata?: ReviewMetadata;     // 추가 메타데이터
}

interface ReviewScores {
  plot: number;                  // 플롯/줄거리 (1-10)
  characterization: number;      // 캐릭터 묘사 (1-10)
  pacing: number;                // 전개 속도/페이싱 (1-10)
  dialogue: number;              // 대화 (1-10)
  worldBuilding: number;         // 세계관 구축 (1-10)
  grammar: number;               // 문법/맞춤법 (1-10)
  engagement: number;            // 몰입도/흥미 (1-10)
}

interface ReviewQuote {
  text: string;                  // 챕터에서 인용한 텍스트
  comment: string;               // 해당 부분에 대한 AI 코멘트
  sentiment: 'positive' | 'negative' | 'neutral';
  startIndex: number;            // 원본 텍스트 시작 위치
  endIndex: number;              // 원본 텍스트 끝 위치
}

interface ReviewMetadata {
  chapterWordCount: number;      // 리뷰 당시 챕터 단어 수
  previousChaptersConsidered: number; // 고려된 이전 챕터 수
  generationTime: number;        // 생성 소요 시간 (ms)
  confidenceScore: number;       // AI 신뢰도 점수 (0-1)
}
```

---

## 6. NovelMetrics (소설 지표)

시간별 소설 통계 스냅샷

```typescript
interface NovelMetrics {
  id: string;                    // UUID
  novelId: string;               // Novel ID (Foreign Key)
  recordedAt: Date;              // 기록 시간
  snapshot: MetricsSnapshot;     // 스냅샷 데이터
  personaMetrics: PersonaMetric[]; // 페르소나별 지표
}

interface MetricsSnapshot {
  totalWords: number;            // 총 단어 수
  totalChapters: number;         // 총 챕터 수
  totalReviews: number;          // 총 리뷰 수
  averageRating: number;         // 평균 평점
  ratingTrend: 'up' | 'down' | 'stable'; // 평점 추세
  completionRate: number;        // 완성도 비율 (%)
  lastUpdateDaysAgo: number;     // 마지막 업데이트 이후 경과 일수
  activeStreak: number;          // 연속 활동 일수
}

interface PersonaMetric {
  personaId: string;             // AIPersona ID
  personaName: string;           // 페르소나 이름 (캐싱)
  averageRating: number;         // 평균 평점
  totalReviews: number;          // 총 리뷰 수
  lastReviewDate: Date;          // 마지막 리뷰 날짜
  engagementLevel: 'low' | 'medium' | 'high'; // 참여도
  ratingHistory: RatingPoint[];  // 평점 히스토리
  topStrength: string;           // 최고 강점 항목
  topWeakness: string;           // 최고 약점 항목
}

interface RatingPoint {
  chapterNumber: number;         // 챕터 번호
  rating: number;                // 평점
  date: Date;                    // 리뷰 날짜
}
```

---

## 7. Achievement (업적)

달성 가능한 업적 정의

```typescript
interface Achievement {
  id: string;                    // UUID
  code: string;                  // 고유 코드 (예: "WEEK_WARRIOR")
  name: string;                  // 업적 이름
  description: string;           // 설명
  icon: string;                  // 아이콘 이미지 URL or emoji
  category: AchievementCategory; // 카테고리
  requirement: AchievementRequirement; // 달성 조건
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; // 희귀도
  points: number;                // 획득 포인트
}

enum AchievementCategory {
  WRITING_VOLUME = 'writing_volume',   // 작성량
  CONSISTENCY = 'consistency',         // 꾸준함
  QUALITY = 'quality',                 // 품질
  MILESTONE = 'milestone',             // 마일스톤
  SOCIAL = 'social',                   // 소셜 (미래 기능)
}

interface AchievementRequirement {
  type: string;                  // 유형 (예: "total_words", "streak_days")
  threshold: number;             // 달성 임계값
  description: string;           // 조건 설명
  isProgressive: boolean;        // 단계적 달성 여부
}

interface UserAchievement {
  id: string;                    // UUID
  userId: string;                // User ID (Foreign Key)
  achievementId: string;         // Achievement ID (Foreign Key)
  unlockedAt: Date;              // 획득 날짜
  progress: number;              // 진행률 (0-100)
  isNotified: boolean;           // 알림 발송 여부
}
```

**업적 예시:**

```typescript
const achievements: Achievement[] = [
  {
    id: '1',
    code: 'FIRST_NOVEL',
    name: '첫 발걸음',
    description: '첫 소설 프로젝트를 생성했습니다',
    icon: '📖',
    category: AchievementCategory.MILESTONE,
    requirement: { type: 'total_novels', threshold: 1, description: '소설 1개 생성', isProgressive: false },
    rarity: 'common',
    points: 10,
  },
  {
    id: '2',
    code: 'WEEK_WARRIOR',
    name: '주간 전사',
    description: '7일 연속으로 작성했습니다',
    icon: '🔥',
    category: AchievementCategory.CONSISTENCY,
    requirement: { type: 'streak_days', threshold: 7, description: '7일 연속 작성', isProgressive: false },
    rarity: 'rare',
    points: 50,
  },
  {
    id: '3',
    code: 'NOVELIST',
    name: '중편 작가',
    description: '총 50,000 단어를 작성했습니다',
    icon: '✍️',
    category: AchievementCategory.WRITING_VOLUME,
    requirement: { type: 'total_words', threshold: 50000, description: '50,000 단어 작성', isProgressive: true },
    rarity: 'epic',
    points: 100,
  },
  {
    id: '4',
    code: 'UNANIMOUS',
    name: '만장일치',
    description: '모든 페르소나로부터 평균 8점 이상을 받았습니다',
    icon: '🌟',
    category: AchievementCategory.QUALITY,
    requirement: { type: 'all_persona_rating', threshold: 8, description: '전체 평균 8점 이상', isProgressive: false },
    rarity: 'legendary',
    points: 200,
  },
];
```

---

## 8. AIConversationContext (AI 대화 컨텍스트)

AI가 이전 챕터를 기억하기 위한 컨텍스트 저장소

```typescript
interface AIConversationContext {
  id: string;                    // UUID
  novelId: string;               // Novel ID (Foreign Key)
  personaId: string;             // AIPersona ID (Foreign Key)
  chapterHistory: ChapterContext[]; // 챕터별 컨텍스트
  characterMemory: CharacterMemory[]; // 캐릭터 정보
  plotPoints: PlotPoint[];       // 주요 플롯 포인트
  worldBuilding: WorldBuildingElement[]; // 세계관 요소
  lastUpdated: Date;             // 마지막 업데이트
  embeddingVersion: string;      // 임베딩 모델 버전
}

interface ChapterContext {
  chapterId: string;             // Chapter ID
  chapterNumber: number;         // 챕터 번호
  summary: string;               // AI 생성 요약
  keyEvents: string[];           // 주요 사건
  emotionalTone: string;         // 감정 톤
  embedding?: number[];          // 벡터 임베딩 (시맨틱 검색용)
  generatedAt: Date;             // 생성 시간
}

interface CharacterMemory {
  name: string;                  // 캐릭터 이름
  aliases: string[];             // 별칭
  firstAppearance: number;       // 첫 등장 챕터
  lastAppearance: number;        // 마지막 등장 챕터
  traits: string[];              // 특성
  relationships: CharacterRelationship[]; // 관계
  developmentNotes: string[];    // 발전 과정
  importance: 'main' | 'supporting' | 'minor'; // 중요도
}

interface CharacterRelationship {
  targetCharacter: string;       // 대상 캐릭터 이름
  relationshipType: string;      // 관계 유형 (예: "친구", "적")
  description: string;           // 관계 설명
}

interface PlotPoint {
  chapterNumber: number;         // 발생 챕터
  description: string;           // 사건 설명
  type: 'setup' | 'conflict' | 'resolution' | 'twist'; // 플롯 유형
  importance: number;            // 중요도 (1-10)
  relatedCharacters: string[];   // 관련 캐릭터
}

interface WorldBuildingElement {
  type: 'location' | 'rule' | 'culture' | 'magic_system' | 'technology';
  name: string;                  // 요소 이름
  description: string;           // 설명
  firstMentioned: number;        // 첫 언급 챕터
  consistency: string[];         // 일관성 규칙
}
```

---

## 9. Notification (알림)

사용자 알림

```typescript
interface Notification {
  id: string;                    // UUID
  userId: string;                // User ID (Foreign Key)
  type: NotificationType;        // 알림 유형
  title: string;                 // 제목
  message: string;               // 메시지
  link?: string;                 // 연결 링크
  isRead: boolean;               // 읽음 여부
  createdAt: Date;               // 생성 시간
  expiresAt?: Date;              // 만료 시간
  metadata?: Record<string, any>; // 추가 데이터
}

enum NotificationType {
  REVIEW_COMPLETED = 'review_completed',       // 리뷰 완료
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked', // 업적 획득
  MILESTONE_REACHED = 'milestone_reached',     // 마일스톤 달성
  SYSTEM_ANNOUNCEMENT = 'system_announcement', // 시스템 공지
  REMINDER = 'reminder',                       // 리마인더
}
```

---

## 10. Session (세션)

사용자 세션 관리 (JWT 대신 DB 세션 사용 시)

```typescript
interface Session {
  id: string;                    // Session ID
  userId: string;                // User ID (Foreign Key)
  token: string;                 // JWT 토큰 또는 세션 토큰
  ipAddress: string;             // IP 주소
  userAgent: string;             // User Agent
  createdAt: Date;               // 생성 시간
  expiresAt: Date;               // 만료 시간
  lastActivityAt: Date;          // 마지막 활동 시간
  isActive: boolean;             // 활성 여부
}
```

---

## API Request/Response 타입

### API 공통 응답

```typescript
interface ApiResponse<T> {
  success: boolean;              // 성공 여부
  data?: T;                      // 응답 데이터
  error?: ApiError;              // 에러 정보
  message?: string;              // 메시지
  timestamp: Date;               // 응답 시간
}

interface ApiError {
  code: string;                  // 에러 코드
  message: string;               // 에러 메시지
  details?: Record<string, any>; // 상세 정보
}
```

### 리뷰 생성 요청

```typescript
interface CreateReviewRequest {
  chapterId: string;             // 챕터 ID
  personaIds: string[];          // 페르소나 ID 목록
  useContext: boolean;           // 컨텍스트 사용 여부
  priority?: 'normal' | 'high';  // 우선순위
}

interface CreateReviewResponse {
  reviewIds: string[];           // 생성된 리뷰 ID 목록
  estimatedTime: number;         // 예상 완료 시간 (초)
  queuePosition?: number;        // 대기열 위치
}
```

---

## 데이터베이스 관계 다이어그램 (ERD 개요)

```
User (1) ──────< (N) Novel
                      │
                      ├──< (N) Chapter
                      │         │
                      │         └──< (N) AIReview ──> (1) AIPersona
                      │
                      └──< (N) NovelMetrics
                                │
                                └──< (N) PersonaMetric

User (1) ──────< (N) UserAchievement ──> (1) Achievement

Novel (1) ──────< (N) AIConversationContext ──> (1) AIPersona

User (1) ──────< (N) Notification
User (1) ──────< (N) Session
```

---

**문서 버전**: 1.0  
**최종 수정**: 2025-12-08  
**다음 업데이트**: Backend 구현 시작 시점에 DB 스키마 상세화
