# 온라인 소설 with AI (Online Novel with AI)

AI 페르소나 기반 소설 피드백 플랫폼 - 초보 작가를 위한 가상 독자 시뮬레이션 게임

---

## 📖 서비스 소개

### 서비스 목적
- 많은 사람들이 웹소설을 작성하지만 초기에는 독자를 모으기 어렵고 피드백을 받기 어렵습니다.
- AI를 통한 가상 독자를 만들어 초보 작가들이 방향성과 피드백을 받을 수 있도록 지원합니다.
- 단순한 시뮬레이션 게임을 넘어 직접 소설을 쓰고 다양한 관점의 평가를 받는 실전 경험을 제공합니다.

### 타겟 사용자
- 🖋️ 처음 소설을 쓰기 시작하는 작가
- 🎮 현실감 있는 시뮬레이션 게임을 원하는 사용자
- 📈 체계적인 피드백을 통해 글쓰기 실력을 향상시키고 싶은 사람

### 핵심 가치
- ✅ **다양한 페르소나**: AI가 각기 다른 페르소나(캐주얼 독자, 문학 평론가, 편집자 등)로 평가/리뷰 제공
- 🧠 **컨텍스트 기억**: 이전 챕터 내용을 기억하고 일관성 있는 평가 제공
- 📊 **시각화된 지표**: 변화하는 작성 지표와 AI 평점 추이를 실시간 확인
- 🏆 **게이미피케이션**: 업적 시스템으로 작성 동기 부여

### Pain Point & Wow Point
- **Pain Point**: 직접 소설을 작성해야 함 (노력 필요)
- **Wow Point**: 지표가 우상향할 때의 성취감과 재미

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: 
  - Zustand (클라이언트 상태)
  - TanStack Query (서버 상태)
- **UI Components**: Lucide React, Recharts
- **Form**: React Hook Form + Zod

### Backend (계획)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **AI Integration**: OpenAI GPT-4, Claude 3.5 Sonnet

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database**: Supabase / PlanetScale
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions

---

## 📁 프로젝트 구조

```
onlineNovelwAI-ryumyunghyun/
├── frontend/                  # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/               # Next.js App Router 페이지
│   │   ├── components/        # React 컴포넌트
│   │   │   ├── common/        # 공통 컴포넌트
│   │   │   ├── novel/         # 소설 관련
│   │   │   ├── ai-feedback/   # AI 피드백
│   │   │   ├── metrics/       # 지표/통계
│   │   │   └── layout/        # 레이아웃
│   │   ├── hooks/             # Custom React Hooks
│   │   ├── stores/            # Zustand 스토어
│   │   ├── services/          # API 서비스
│   │   ├── types/             # TypeScript 타입
│   │   ├── utils/             # 유틸리티
│   │   └── constants/         # 상수
│   └── package.json
├── backend/                   # Express 백엔드 (계획)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── ai/                # AI 통합 로직
│   │   ├── routes/
│   │   └── middleware/
│   └── prisma/                # DB 스키마
├── docs/                      # 프로젝트 문서
│   └── wiki/
│       ├── ai-principles.md   # AI 활용 원칙
│       ├── user-stories.md    # Given-When-Then 스토리
│       ├── data-structures.md # 데이터 구조
│       └── architecture.md    # 아키텍처 설계
└── README.md
```

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 20+ 
- npm 또는 yarn
- Git

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/boostcampwm-snu-2025/onlineNovelwAI-ryumyunghyun.git
cd onlineNovelwAI-ryumyunghyun

# 프론트엔드 설치 및 실행
cd frontend
npm install
npm run dev
```

프론트엔드는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

---

## 🌿 브랜치 전략

### 브랜치 구조
- `main`: 프로덕션 배포용 브랜치 (직접 개발 금지)
- `develop`: 개발 통합 브랜치
- `feature/[기능명]`: 새 기능 개발
- `fix/[버그명]`: 버그 수정
- `docs/[문서명]`: 문서 작업

### 브랜치 네이밍 규칙
```
feature/novel-editor
feature/ai-review-system
fix/auto-save-bug
docs/api-documentation
```

### 워크플로우
1. `main` 또는 `develop`에서 feature 브랜치 생성
2. 기능 개발 및 커밋
3. Push 후 Pull Request 생성
4. 코드 리뷰 및 승인
5. `main` 또는 `develop`으로 머지

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드/설정 변경
```

---

## 📝 개발 원칙

### React 프로그래밍 원칙
1. **단일 책임 원칙**: 컴포넌트는 하나의 명확한 역할만 수행
2. **역할별 디렉토리 구조**: `components/`, `hooks/`, `services/` 등으로 구분
3. **일관된 네이밍**: camelCase (변수/함수), PascalCase (컴포넌트/타입)
4. **React Hooks 활용**: useState, useEffect, custom hooks 적극 사용
5. **최소 전역 상태**: Zustand로 필요한 경우만 전역 상태 관리
6. **타입 안전성**: TypeScript로 모든 타입 명시

### AI 활용 원칙
- AI 모델: GPT-4 (Primary), Claude 3.5 Sonnet (Secondary)
- 페르소나: 캐주얼 독자, 문학 평론가, 장르 팬, 편집자, 출판인, 동료 작가 (6종)
- 컨텍스트 관리: 이전 챕터 요약 및 임베딩으로 기억 유지
- 비용 관리: 캐싱, Rate Limiting, 모델 선택 최적화

자세한 내용은 [AI 활용 원칙 문서](./docs/wiki/ai-principles.md)를 참고하세요.

---

## 📚 문서

프로젝트의 모든 설계 문서는 `docs/wiki/` 디렉토리에 있습니다:

- [AI 활용 원칙](./docs/wiki/ai-principles.md) - AI 모델 선택, 페르소나 설계, 윤리 가이드라인
- [사용자 스토리](./docs/wiki/user-stories.md) - Given-When-Then 형식의 기능 시나리오
- [데이터 구조](./docs/wiki/data-structures.md) - TypeScript 인터페이스 및 DB 스키마
- [아키텍처 설계](./docs/wiki/architecture.md) - 시스템 구조, API 설계, 배포 전략

---

## 🎯 Week 3 데모 목표

### 필수 기능
1. ✅ 사용자 회원가입/로그인
2. ✅ 소설 프로젝트 생성
3. ✅ 챕터 작성 (기본 에디터)
4. ✅ AI 리뷰 요청 (2개 페르소나)
5. ✅ 기본 대시보드 (통계/지표)

### 기술 과제
- [ ] JWT 인증 구현
- [ ] PostgreSQL 데이터베이스 연결
- [ ] OpenAI API 통합
- [ ] 자동 저장 기능
- [ ] 반응형 UI

---

## 🤝 기여 방법

### Pull Request 가이드라인
1. **작은 단위로 분할**: 너무 큰 PR보다 작은 PR 여러 개
2. **명확한 제목과 설명**: 무엇을, 왜, 어떻게 변경했는지 명시
3. **테스트 포함**: 가능한 경우 테스트 코드 작성
4. **코드 리뷰 준수**: 최소 1명 이상의 승인 필요

### Issue 등록
- 버그 리포트: `[BUG]` 라벨
- 기능 요청: `[FEATURE]` 라벨
- 문서 개선: `[DOCS]` 라벨

---

## 📄 라이선스

이 프로젝트는 Boost Camp 교육용 프로젝트입니다.

---

## 👥 팀

**Boost Camp Web/Mobile 2025** - SNU

---

## 📞 문의

프로젝트 관련 문의사항은 Issues 탭에 등록해주세요.
