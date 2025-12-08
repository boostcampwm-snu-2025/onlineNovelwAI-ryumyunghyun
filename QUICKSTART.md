# Quick Start Guide

빠른 시작을 위한 가이드

---

## 🎯 Week 2 완료 사항

✅ 프로젝트 구조 설정  
✅ 5개 핵심 문서 작성 (AI 원칙, 사용자 스토리, 데이터 구조, 아키텍처, Week 3 범위)  
✅ 프론트엔드 Next.js 프로젝트 생성  
✅ 백엔드 기본 구조 생성  
✅ README 및 브랜치 전략 문서화

---

## 🚀 Week 3 시작 가이드

### Step 1: 환경 설정

#### 1.1 데이터베이스 설정 (PostgreSQL)

**Option A: Docker 사용 (권장)**
```bash
docker run --name novel-ai-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=novel_ai_db \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: 로컬 설치**
- PostgreSQL 15+ 설치
- 데이터베이스 생성: `novel_ai_db`

#### 1.2 환경 변수 설정

**Backend `.env` 파일 생성:**
```bash
cd backend
cp .env.example .env
```

`.env` 파일 수정:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/novel_ai_db"
JWT_SECRET="your-secret-key-change-this"
OPENAI_API_KEY="sk-your-openai-key"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

#### 1.3 의존성 설치

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

---

### Step 2: 백엔드 개발

#### 2.1 Prisma 설정
```bash
cd backend

# Prisma Client 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev --name init

# (Optional) Prisma Studio로 DB 확인
npx prisma studio
```

#### 2.2 개발 우선순위

**Phase 1: 인증 시스템**
1. `src/controllers/authController.ts` - 회원가입/로그인 로직
2. `src/services/authService.ts` - JWT 생성/검증
3. `src/middleware/authMiddleware.ts` - 인증 미들웨어
4. `src/routes/authRoutes.ts` - 인증 라우트

**Phase 2: Novel & Chapter API**
1. `src/controllers/novelController.ts`
2. `src/services/novelService.ts`
3. `src/routes/novelRoutes.ts`
4. 동일하게 Chapter 구현

**Phase 3: AI 통합**
1. `src/ai/aiService.ts` - AI 서비스 추상화
2. `src/ai/openaiProvider.ts` - OpenAI 통합
3. `src/ai/promptTemplates.ts` - 페르소나 프롬프트
4. `src/controllers/reviewController.ts` - 리뷰 API

#### 2.3 서버 실행
```bash
npm run dev
```
→ http://localhost:5000

---

### Step 3: 프론트엔드 개발

#### 3.1 개발 우선순위

**Phase 1: 기본 레이아웃**
1. `src/components/layout/Header.tsx`
2. `src/components/layout/Sidebar.tsx`
3. `src/app/layout.tsx` - 루트 레이아웃

**Phase 2: 인증 페이지**
1. `src/app/(auth)/login/page.tsx`
2. `src/app/(auth)/register/page.tsx`
3. `src/stores/authStore.ts` - Zustand 인증 스토어
4. `src/services/authService.ts` - API 호출

**Phase 3: 소설/챕터 페이지**
1. `src/app/dashboard/page.tsx` - 대시보드
2. `src/app/novels/page.tsx` - 소설 목록
3. `src/app/novels/[novelId]/page.tsx` - 소설 상세
4. `src/app/novels/[novelId]/edit/page.tsx` - 에디터
5. `src/components/novel/NovelEditor.tsx` - 에디터 컴포넌트

**Phase 4: AI 리뷰**
1. `src/components/ai-feedback/PersonaSelector.tsx`
2. `src/components/ai-feedback/ReviewCard.tsx`
3. `src/hooks/useAIReview.ts` - TanStack Query 훅

#### 3.2 서버 실행
```bash
npm run dev
```
→ http://localhost:3000

---

### Step 4: 필수 컴포넌트 개발 순서

#### Week 3.1 (1-2일차)
- [ ] Backend: User 인증 API
- [ ] Frontend: 로그인/회원가입 UI
- [ ] 연동 테스트

#### Week 3.2 (3-4일차)
- [ ] Backend: Novel/Chapter CRUD API
- [ ] Frontend: 소설 목록, 생성 UI
- [ ] Frontend: 챕터 에디터 (기본 textarea)
- [ ] 자동 저장 기능

#### Week 3.3 (5-6일차)
- [ ] Backend: OpenAI 통합
- [ ] Backend: 2개 페르소나 프롬프트 작성
- [ ] Frontend: AI 리뷰 요청 UI
- [ ] Frontend: 리뷰 표시 컴포넌트

#### Week 3.4 (7일차)
- [ ] Frontend: 대시보드 (기본 통계)
- [ ] 전체 플로우 테스트
- [ ] 버그 수정
- [ ] 데모 준비

---

## 🔧 개발 팁

### 백엔드

**API 테스트 (Thunder Client / Postman)**
```http
### 회원가입
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "penName": "테스트작가"
}

### 로그인
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**에러 로깅**
```typescript
// utils/logger.ts 사용
import logger from './utils/logger';

logger.info('User registered', { userId: user.id });
logger.error('Failed to create novel', { error: err.message });
```

### 프론트엔드

**환경 변수 (`.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**API 호출 예시**
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터로 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**TanStack Query 설정**
```typescript
// app/layout.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

## 📝 브랜치 워크플로우

### 새 기능 개발 시

```bash
# develop 브랜치에서 시작
git checkout develop
git pull origin develop

# feature 브랜치 생성
git checkout -b feature/novel-editor

# 개발 및 커밋
git add .
git commit -m "feat: add novel editor component"

# Push
git push origin feature/novel-editor

# GitHub에서 PR 생성
# develop 브랜치로 머지 요청
```

### 커밋 메시지 예시
```
feat: add user authentication API
fix: resolve auto-save timing issue
docs: update API documentation
style: format code with prettier
refactor: improve AI prompt structure
test: add unit tests for novelService
chore: update dependencies
```

---

## 🐛 문제 해결

### 프론트엔드 빌드 에러
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 백엔드 Prisma 에러
```bash
# Prisma Client 재생성
npx prisma generate

# 마이그레이션 리셋 (개발 시만!)
npx prisma migrate reset
```

### 포트 충돌
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

---

## 📚 참고 문서

### 내부 문서
- [README.md](./README.md) - 프로젝트 개요
- [SETUP_SUMMARY.md](./SETUP_SUMMARY.md) - 설정 완료 요약
- [docs/wiki/](./docs/wiki/) - 모든 설계 문서

### 외부 리소스
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## ✅ 데일리 체크리스트

매일 개발 전:
- [ ] `git pull origin develop` 로 최신 코드 받기
- [ ] 백엔드 서버 실행 확인
- [ ] 프론트엔드 서버 실행 확인
- [ ] 데이터베이스 연결 확인

매일 개발 후:
- [ ] 작성한 코드 커밋
- [ ] PR 생성 또는 업데이트
- [ ] 팀원에게 리뷰 요청
- [ ] 다음 날 할 일 정리

---

**Good Luck! 🚀**

문제가 있으면 Issues 탭에 등록하거나 팀원과 상의하세요.
