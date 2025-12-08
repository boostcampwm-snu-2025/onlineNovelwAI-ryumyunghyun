# 아키텍처 설계 (Architecture Design)

온라인 소설 AI 플랫폼의 전체 시스템 아키텍처

---

## 1. 시스템 개요

### 고수준 아키텍처

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│   Client    │          │   Backend   │          │  AI Service │
│  (Next.js)  │ ◄─────► │  (Express)  │ ◄─────► │  (OpenAI)   │
│             │   REST   │             │   API    │  (Claude)   │
└─────────────┘   API    └─────────────┘          └─────────────┘
                              │
                              ▼
                         ┌─────────────┐
                         │  PostgreSQL │
                         │  Database   │
                         └─────────────┘
```

### 레이어 구조

```
┌──────────────────────────────────────────┐
│         Presentation Layer               │  ← Next.js, React Components
├──────────────────────────────────────────┤
│         Application Layer                │  ← API Routes, Business Logic
├──────────────────────────────────────────┤
│         Domain Layer                     │  ← Core Models, Entities
├──────────────────────────────────────────┤
│         Data Access Layer                │  ← ORM (Prisma), Repositories
├──────────────────────────────────────────┤
│         Infrastructure Layer             │  ← Database, External APIs
└──────────────────────────────────────────┘
```

---

## 2. 프론트엔드 아키텍처 (Frontend)

### 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: 
  - **Zustand**: 클라이언트 상태 (UI, 에디터 상태)
  - **TanStack Query**: 서버 상태 (API 데이터)
- **Form Management**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

### 디렉토리 구조

```
frontend/
├── public/                    # 정적 파일
│   ├── images/
│   └── fonts/
├── src/
│   ├── app/                   # Next.js App Router 페이지
│   │   ├── (auth)/            # 인증 라우트 그룹
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # 대시보드 라우트 그룹
│   │   │   ├── dashboard/
│   │   │   ├── novels/
│   │   │   │   └── [novelId]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── edit/
│   │   │   │       └── review/
│   │   │   └── achievements/
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈페이지
│   │   └── globals.css
│   ├── components/            # React 컴포넌트
│   │   ├── common/            # 공통 컴포넌트
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Loading/
│   │   │   └── Card/
│   │   ├── layout/            # 레이아웃 컴포넌트
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── Footer/
│   │   ├── novel/             # 소설 관련
│   │   │   ├── NovelEditor/
│   │   │   ├── ChapterList/
│   │   │   ├── NovelCard/
│   │   │   └── ChapterNavigation/
│   │   ├── ai-feedback/       # AI 피드백
│   │   │   ├── PersonaCard/
│   │   │   ├── ReviewList/
│   │   │   ├── ReviewDetail/
│   │   │   └── PersonaSelector/
│   │   └── metrics/           # 지표/통계
│   │       ├── MetricsDashboard/
│   │       ├── MetricsChart/
│   │       └── AchievementBadge/
│   ├── hooks/                 # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useNovel.ts
│   │   ├── useChapter.ts
│   │   ├── useAIReview.ts
│   │   ├── useMetrics.ts
│   │   └── useAutoSave.ts
│   ├── stores/                # Zustand 스토어
│   │   ├── authStore.ts
│   │   ├── editorStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   ├── services/              # API 서비스
│   │   ├── api.ts             # Axios 설정
│   │   ├── authService.ts
│   │   ├── novelService.ts
│   │   ├── chapterService.ts
│   │   ├── reviewService.ts
│   │   └── metricsService.ts
│   ├── types/                 # TypeScript 타입
│   │   ├── user.ts
│   │   ├── novel.ts
│   │   ├── chapter.ts
│   │   ├── review.ts
│   │   └── api.ts
│   ├── utils/                 # 유틸리티 함수
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── dateUtils.ts
│   │   └── textUtils.ts
│   └── constants/             # 상수
│       ├── routes.ts
│       ├── config.ts
│       └── personas.ts
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

### 상태 관리 전략

#### Zustand (클라이언트 상태)

```typescript
// stores/editorStore.ts
interface EditorState {
  currentNovelId: string | null;
  currentChapterId: string | null;
  content: string;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  setContent: (content: string) => void;
  saveChapter: () => Promise<void>;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentNovelId: null,
  currentChapterId: null,
  content: '',
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  // ... actions
}));
```

#### TanStack Query (서버 상태)

```typescript
// hooks/useNovel.ts
export function useNovel(novelId: string) {
  return useQuery({
    queryKey: ['novel', novelId],
    queryFn: () => novelService.getById(novelId),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
}

export function useUpdateNovel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: novelService.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['novel', data.id]);
      queryClient.invalidateQueries(['novels']);
    },
  });
}
```

### 컴포넌트 설계 원칙

1. **단일 책임 원칙 (SRP)**
   - 각 컴포넌트는 하나의 명확한 책임만 가짐
   - 예: `NovelEditor`는 편집만, `AutoSaveIndicator`는 저장 상태 표시만

2. **재사용성**
   - `common/` 폴더의 컴포넌트는 프로젝트 전역에서 재사용
   - Props 인터페이스 명확히 정의

3. **컴포지션 우선**
   - 상속보다 컴포지션 사용
   - Children props 활용

4. **타입 안전성**
   - 모든 컴포넌트에 TypeScript 인터페이스 정의
   - Props validation

---

## 3. 백엔드 아키텍처 (Backend)

### 기술 스택

- **Runtime**: Node.js 20+
- **Framework**: Express.js 또는 Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **AI Integration**: OpenAI SDK, Anthropic SDK
- **Caching**: Redis (optional, for AI response caching)

### 디렉토리 구조

```
backend/
├── src/
│   ├── controllers/           # 요청 핸들러
│   │   ├── authController.ts
│   │   ├── novelController.ts
│   │   ├── chapterController.ts
│   │   ├── reviewController.ts
│   │   └── metricsController.ts
│   ├── services/              # 비즈니스 로직
│   │   ├── authService.ts
│   │   ├── novelService.ts
│   │   ├── chapterService.ts
│   │   ├── reviewService.ts
│   │   └── metricsService.ts
│   ├── ai/                    # AI 통합
│   │   ├── aiService.ts       # AI 서비스 추상화
│   │   ├── openaiProvider.ts
│   │   ├── claudeProvider.ts
│   │   ├── promptTemplates.ts
│   │   └── contextManager.ts  # 컨텍스트 관리
│   ├── models/                # Prisma 모델 (generated)
│   ├── repositories/          # 데이터 접근 레이어
│   │   ├── userRepository.ts
│   │   ├── novelRepository.ts
│   │   └── reviewRepository.ts
│   ├── middleware/            # Express 미들웨어
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   ├── validator.ts
│   │   └── rateLimiter.ts
│   ├── routes/                # API 라우트
│   │   ├── authRoutes.ts
│   │   ├── novelRoutes.ts
│   │   ├── chapterRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   └── metricsRoutes.ts
│   ├── utils/                 # 유틸리티
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── types/                 # TypeScript 타입
│   │   └── index.ts
│   ├── config/                # 설정
│   │   ├── database.ts
│   │   ├── ai.ts
│   │   └── app.ts
│   ├── app.ts                 # Express 앱 설정
│   └── server.ts              # 서버 시작점
├── prisma/
│   ├── schema.prisma          # Prisma 스키마
│   ├── migrations/            # DB 마이그레이션
│   └── seed.ts                # 시드 데이터
├── tests/                     # 테스트
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
└── .env.example
```

### API 엔드포인트 설계

#### 인증 (Authentication)

```
POST   /api/auth/register       # 회원가입
POST   /api/auth/login          # 로그인
POST   /api/auth/logout         # 로그아웃
POST   /api/auth/refresh        # 토큰 갱신
GET    /api/auth/me             # 현재 사용자 정보
```

#### 소설 (Novels)

```
GET    /api/novels              # 소설 목록 조회
POST   /api/novels              # 소설 생성
GET    /api/novels/:id          # 소설 상세 조회
PUT    /api/novels/:id          # 소설 수정
DELETE /api/novels/:id          # 소설 삭제
GET    /api/novels/:id/metrics  # 소설 지표 조회
```

#### 챕터 (Chapters)

```
GET    /api/novels/:novelId/chapters            # 챕터 목록
POST   /api/novels/:novelId/chapters            # 챕터 생성
GET    /api/chapters/:id                        # 챕터 조회
PUT    /api/chapters/:id                        # 챕터 수정
DELETE /api/chapters/:id                        # 챕터 삭제
PATCH  /api/chapters/:id/reorder                # 순서 변경
```

#### AI 리뷰 (Reviews)

```
POST   /api/chapters/:chapterId/reviews         # 리뷰 생성 요청
GET    /api/chapters/:chapterId/reviews         # 리뷰 목록
GET    /api/reviews/:id                         # 리뷰 상세
DELETE /api/reviews/:id                         # 리뷰 삭제
POST   /api/reviews/:id/feedback                # 리뷰 피드백 (도움됨/안됨)
```

#### 페르소나 (Personas)

```
GET    /api/personas                            # 페르소나 목록
GET    /api/personas/:id                        # 페르소나 상세
```

#### 지표 (Metrics)

```
GET    /api/users/me/stats                      # 사용자 통계
GET    /api/novels/:id/analytics                # 소설 분석
GET    /api/achievements                        # 업적 목록
GET    /api/users/me/achievements               # 내 업적
```

### 인증 흐름

```
┌────────┐                ┌────────┐                ┌──────────┐
│ Client │                │ Server │                │ Database │
└────┬───┘                └───┬────┘                └────┬─────┘
     │                        │                          │
     │  POST /auth/login      │                          │
     │ ──────────────────────>│                          │
     │                        │  Query user              │
     │                        │ ─────────────────────────>│
     │                        │                          │
     │                        │  User data               │
     │                        │ <─────────────────────────│
     │                        │                          │
     │  JWT Token             │ Verify password          │
     │ <──────────────────────│ Generate JWT             │
     │                        │                          │
     │  GET /api/novels       │                          │
     │  Authorization: Bearer │                          │
     │ ──────────────────────>│                          │
     │                        │ Verify JWT               │
     │                        │ Extract userId           │
     │                        │                          │
     │                        │  Query novels            │
     │                        │ ─────────────────────────>│
     │                        │                          │
     │  Novels data           │  Novels data             │
     │ <──────────────────────│ <─────────────────────────│
```

---

## 4. AI 통합 아키텍처

### AI 서비스 추상화 레이어

```typescript
// ai/aiService.ts
interface AIProvider {
  generateReview(params: ReviewParams): Promise<AIReview>;
  generateSummary(text: string): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
}

class AIService {
  private providers: Map<string, AIProvider>;
  
  constructor() {
    this.providers = new Map([
      ['gpt-4', new OpenAIProvider('gpt-4')],
      ['claude-3.5-sonnet', new ClaudeProvider()],
    ]);
  }
  
  async generateReview(
    chapterId: string, 
    personaId: string,
    useContext: boolean
  ): Promise<AIReview> {
    const chapter = await getChapter(chapterId);
    const persona = await getPersona(personaId);
    const context = useContext ? await getContext(chapterId, personaId) : null;
    
    const provider = this.selectProvider(chapter.wordCount);
    const prompt = buildPrompt(chapter, persona, context);
    
    return await provider.generateReview({
      prompt,
      persona,
      chapter,
      context,
    });
  }
  
  private selectProvider(wordCount: number): AIProvider {
    // 짧은 챕터는 GPT-3.5, 긴 챕터는 Claude
    return wordCount < 1000 
      ? this.providers.get('gpt-3.5-turbo')
      : this.providers.get('claude-3.5-sonnet');
  }
}
```

### 프롬프트 템플릿

```typescript
// ai/promptTemplates.ts
export function buildReviewPrompt(
  chapter: Chapter,
  persona: AIPersona,
  context?: AIConversationContext
): string {
  return `
You are ${persona.name}, ${persona.description}.

${context ? `Previous chapters summary:\n${context.summary}\n\n` : ''}

Evaluate this chapter (Chapter ${chapter.chapterNumber}):
Title: ${chapter.title}
Content:
"""
${chapter.content}
"""

Provide your review in the following JSON format:
{
  "overallRating": <number 1-10>,
  "sentiment": "<positive|neutral|negative>",
  "reviewText": "<your detailed review>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "improvements": ["<improvement 1>", "<improvement 2>", ...],
  "detailedScores": {
    "plot": <1-10>,
    "characterization": <1-10>,
    "pacing": <1-10>,
    "dialogue": <1-10>,
    "worldBuilding": <1-10>,
    "grammar": <1-10>,
    "engagement": <1-10>
  },
  "quotes": [
    {
      "text": "<quoted text>",
      "comment": "<your comment>",
      "sentiment": "<positive|negative|neutral>"
    }
  ]
}

Stay in character as ${persona.name}. ${persona.systemPrompt}
`;
}
```

### 컨텍스트 관리

```typescript
// ai/contextManager.ts
class ContextManager {
  async getContext(
    novelId: string, 
    personaId: string
  ): Promise<AIConversationContext> {
    // 캐시에서 확인
    const cached = await redis.get(`context:${novelId}:${personaId}`);
    if (cached) return JSON.parse(cached);
    
    // DB에서 로드
    const context = await prisma.aIConversationContext.findUnique({
      where: { novelId_personaId: { novelId, personaId } },
      include: { chapterHistory: true, characterMemory: true },
    });
    
    if (context) {
      await redis.setex(
        `context:${novelId}:${personaId}`, 
        3600, 
        JSON.stringify(context)
      );
    }
    
    return context;
  }
  
  async updateContext(
    novelId: string,
    personaId: string,
    newChapter: Chapter,
    review: AIReview
  ): Promise<void> {
    // AI로 챕터 요약 생성
    const summary = await aiService.generateSummary(newChapter.content);
    
    // 컨텍스트 업데이트
    await prisma.aIConversationContext.upsert({
      where: { novelId_personaId: { novelId, personaId } },
      update: {
        chapterHistory: {
          create: {
            chapterId: newChapter.id,
            chapterNumber: newChapter.chapterNumber,
            summary,
            keyEvents: extractKeyEvents(review),
          },
        },
        lastUpdated: new Date(),
      },
      create: {
        novelId,
        personaId,
        chapterHistory: {
          create: {
            chapterId: newChapter.id,
            chapterNumber: newChapter.chapterNumber,
            summary,
            keyEvents: extractKeyEvents(review),
          },
        },
      },
    });
    
    // 캐시 무효화
    await redis.del(`context:${novelId}:${personaId}`);
  }
}
```

### 비용 최적화 전략

1. **응답 캐싱**
   ```typescript
   const cacheKey = `review:${chapterId}:${personaId}:${chapterHash}`;
   const cached = await redis.get(cacheKey);
   if (cached) return JSON.parse(cached);
   
   const review = await generateReview(...);
   await redis.setex(cacheKey, 86400, JSON.stringify(review)); // 24시간
   ```

2. **Rate Limiting**
   - 사용자당 일일 5회 리뷰 제한
   - 프리미엄 사용자는 무제한

3. **모델 선택**
   - 짧은 텍스트: GPT-3.5-turbo
   - 긴 텍스트: Claude 3.5 Sonnet
   - 컨텍스트 필요: Claude (200K context window)

---

## 5. 데이터베이스 설계

### Prisma 스키마 예시

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  penName       String
  profileImage  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  novels        Novel[]
  achievements  UserAchievement[]
  notifications Notification[]
  sessions      Session[]
  
  preferences   Json      // UserPreferences
  stats         Json      // UserStats
  
  @@map("users")
}

model Novel {
  id          String      @id @default(uuid())
  authorId    String
  title       String
  description String
  genre       String
  coverImage  String?
  status      String
  visibility  String      @default("private")
  tags        String[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  metadata    Json        // NovelMetadata
  
  author      User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
  chapters    Chapter[]
  metrics     NovelMetrics[]
  contexts    AIConversationContext[]
  
  @@map("novels")
}

model Chapter {
  id            String      @id @default(uuid())
  novelId       String
  chapterNumber Int
  title         String
  content       String      @db.Text
  wordCount     Int
  status        String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  publishedAt   DateTime?
  notes         String?     @db.Text
  
  novel         Novel       @relation(fields: [novelId], references: [id], onDelete: Cascade)
  reviews       AIReview[]
  
  @@unique([novelId, chapterNumber])
  @@map("chapters")
}

model AIPersona {
  id           String      @id @default(uuid())
  name         String
  type         String
  description  String
  avatarImage  String
  systemPrompt String      @db.Text
  traits       Json        // PersonaTrait[]
  rating       Json        // {minScore, maxScore}
  isActive     Boolean     @default(true)
  color        String
  createdAt    DateTime    @default(now())
  
  reviews      AIReview[]
  contexts     AIConversationContext[]
  
  @@map("ai_personas")
}

model AIReview {
  id             String      @id @default(uuid())
  chapterId      String
  personaId      String
  novelId        String
  overallRating  Float
  sentiment      String
  reviewText     String      @db.Text
  strengths      String[]
  improvements   String[]
  detailedScores Json        // ReviewScores
  quotes         Json        // ReviewQuote[]
  contextAware   Boolean     @default(false)
  generatedAt    DateTime    @default(now())
  aiModel        String
  tokenUsage     Int
  metadata       Json?       // ReviewMetadata
  
  chapter        Chapter     @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  persona        AIPersona   @relation(fields: [personaId], references: [id])
  
  @@map("ai_reviews")
}

// ... 나머지 모델들
```

### 인덱싱 전략

```sql
-- 자주 사용되는 쿼리 최적화
CREATE INDEX idx_novels_author_id ON novels(author_id);
CREATE INDEX idx_chapters_novel_id ON chapters(novel_id);
CREATE INDEX idx_reviews_chapter_id ON ai_reviews(chapter_id);
CREATE INDEX idx_reviews_persona_id ON ai_reviews(persona_id);
CREATE INDEX idx_reviews_generated_at ON ai_reviews(generated_at DESC);

-- 복합 인덱스
CREATE INDEX idx_chapters_novel_number ON chapters(novel_id, chapter_number);
CREATE INDEX idx_novels_author_status ON novels(author_id, status);
```

---

## 6. 보안 고려사항

### 인증 및 권한

1. **JWT 토큰**
   - Access Token: 15분 유효
   - Refresh Token: 7일 유효
   - HttpOnly Cookie에 저장

2. **비밀번호**
   - bcrypt로 해싱 (salt rounds: 12)
   - 최소 8자, 대소문자/숫자/특수문자 포함

3. **API 보호**
   - Rate Limiting: 사용자당 분당 60 요청
   - CORS 설정
   - Helmet.js로 보안 헤더 설정

### 데이터 보호

1. **환경 변수**
   - `.env` 파일로 민감 정보 관리
   - `.env.example`로 템플릿 제공

2. **API 키 보호**
   - OpenAI/Claude API 키는 백엔드만 사용
   - 프론트엔드에 절대 노출 금지

3. **입력 검증**
   - Zod로 모든 입력 데이터 검증
   - SQL Injection 방지 (Prisma ORM 사용)
   - XSS 방지 (입력 sanitization)

---

## 7. 배포 아키텍처

### 개발 환경

```
Local Development:
- Frontend: localhost:3000
- Backend: localhost:5000
- Database: PostgreSQL (Docker)
- Redis: localhost:6379 (Docker)
```

### 프로덕션 환경

```
┌──────────────┐
│   Vercel     │  ← Next.js Frontend
│  (Frontend)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Railway    │  ← Express Backend
│  (Backend)   │
└──────┬───────┘
       │
       ├────────► PostgreSQL (Supabase or Railway)
       ├────────► Redis (Upstash)
       └────────► AI APIs (OpenAI/Anthropic)
```

### CI/CD 파이프라인

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
```

---

## 8. 모니터링 및 로깅

### 로깅 전략

```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### 메트릭 추적

- API 응답 시간
- AI 토큰 사용량
- 데이터베이스 쿼리 시간
- 에러율
- 활성 사용자 수

---

## 9. 성능 최적화

### 프론트엔드

1. **코드 스플리팅**
   - Next.js dynamic imports
   - Route-based splitting

2. **이미지 최적화**
   - Next.js Image component
   - WebP 포맷 사용

3. **캐싱**
   - TanStack Query의 staleTime 활용
   - Service Worker (PWA)

### 백엔드

1. **데이터베이스**
   - 적절한 인덱싱
   - Connection pooling
   - Query optimization

2. **API**
   - Response compression (gzip)
   - Pagination
   - Field selection (GraphQL-style)

3. **캐싱**
   - Redis로 자주 조회되는 데이터 캐싱
   - AI 응답 캐싱

---

**문서 버전**: 1.0  
**최종 수정**: 2025-12-08  
**다음 업데이트**: Week 3 개발 시작 후 실제 구현 경험 반영
