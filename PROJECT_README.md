# 온라인 소설 with AI (Online Novel with AI Comments)

AI 독자 페르소나가 자동으로 댓글을 다는 온라인 소설 플랫폼

## 📖 프로젝트 소개

사용자가 연재 소설을 작성하면 6명의 서로 다른 AI 페르소나가 자동으로 리뷰와 평가를 제공하는 웹 애플리케이션입니다.

### AI 페르소나 (6종)
1. **캐주얼 독자** 📖 - 재미와 몰입도 중심 평가
2. **문학 평론가** 🎓 - 문학적 가치와 서사 구조 분석
3. **장르 팬** ⭐ - 장르 문법과 독창성 평가
4. **편집자** ✏️ - 맞춤법, 문법, 가독성 검토
5. **상업 출판인** 💼 - 시장성과 상업적 잠재력 분석
6. **창작 작가 동료** 🤝 - 격려와 창작 과정 지원

## 🏗️ 기술 스택

### Backend
- **Node.js** + **Express** + **TypeScript**
- **SQLite** (로컬 데이터베이스)
- **OpenAI API** (GPT-4 / GPT-3.5-turbo)
- **JWT** 인증

### Frontend
- **React** + **TypeScript**
- **React Router** (라우팅)
- **Axios** (API 통신)

## 🚀 시작하기

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn
- OpenAI API 키

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd onlineNovelwAI-ryumyunghyun
```

### 2. Backend 설정

```bash
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# .env 파일을 열어서 다음 값을 설정하세요:
# OPENAI_API_KEY=your-openai-api-key-here
# JWT_SECRET=your-secret-key-here
# PORT=5000
```

**중요: `.env` 파일에 실제 OpenAI API 키를 입력해야 합니다!**

### 3. Frontend 설정

```bash
cd ../frontend

# 의존성 설치
npm install
```

### 4. 실행

**터미널 1 - Backend 서버 실행:**
```bash
cd backend
npm run dev
```
서버가 `http://localhost:5000` 에서 실행됩니다.

**터미널 2 - Frontend 개발 서버 실행:**
```bash
cd frontend
npm start
```
프론트엔드가 `http://localhost:3000` 에서 실행됩니다.

## 📱 사용 방법

### 1. 회원가입 / 로그인
- `http://localhost:3000` 접속
- 회원가입 또는 로그인

### 2. 소설 작성
- 대시보드에서 "새 챕터 작성" 클릭
- 새 소설 만들기 또는 기존 소설 선택
- 챕터 정보 입력 (챕터 번호, 제목, 내용)
- 업로드 버튼 클릭

### 3. AI 리뷰 확인
- 챕터 업로드 후 자동으로 6명의 AI 페르소나가 리뷰 생성
- 각 페르소나별 평점(1-10)과 상세 코멘트 확인
- 장점, 개선점, 종합평가 섹션으로 구성

### 4. 대시보드
- 내가 작성한 모든 소설 목록
- 각 소설별 챕터 수 확인
- 소설 상세보기 및 챕터 추가

## 🗂️ 프로젝트 구조

```
onlineNovelwAI-ryumyunghyun/
├── backend/                    # Backend 서버
│   ├── src/
│   │   ├── config/            # 데이터베이스 설정
│   │   ├── controllers/       # API 컨트롤러
│   │   ├── middleware/        # 인증 미들웨어
│   │   ├── routes/            # API 라우트
│   │   ├── services/          # 비즈니스 로직
│   │   │   └── ai/           # OpenAI 서비스
│   │   └── index.ts          # 서버 진입점
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Frontend 애플리케이션
│   ├── src/
│   │   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── context/           # React Context (Auth)
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── services/          # API 서비스
│   │   ├── types/             # TypeScript 타입
│   │   ├── App.tsx            # 메인 앱 컴포넌트
│   │   └── index.tsx          # 진입점
│   ├── package.json
│   └── tsconfig.json
│
└── docs/                       # 문서
    └── wiki/
        └── ai-principles.md   # AI 활용 원칙
```

## 🔑 주요 기능

### Backend API 엔드포인트

#### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

#### 소설 관리
- `POST /api/novels` - 새 소설 생성
- `GET /api/novels` - 내 소설 목록
- `GET /api/novels/:id` - 소설 상세 정보

#### 챕터 관리
- `POST /api/chapters` - 새 챕터 업로드 (AI 리뷰 자동 생성)
- `GET /api/chapters/:id` - 챕터 및 리뷰 조회

### AI 리뷰 생성 프로세스

1. 사용자가 챕터 업로드
2. 시스템이 해당 소설의 모든 이전 챕터 로드
3. 6개 페르소나가 병렬로 리뷰 생성
   - 짧은 챕터(<1000자): GPT-3.5-turbo 사용
   - 긴 챕터(≥1000자): GPT-4 사용
4. 각 페르소나별 시스템 프롬프트 + 이전 챕터 컨텍스트 포함
5. 리뷰 저장 및 사용자에게 표시

## 🎨 UI/UX 특징

- **한국어 인터페이스** - 모든 UI 및 AI 리뷰가 한국어로 제공
- **반응형 디자인** - 데스크톱과 모바일에서 모두 사용 가능
- **실시간 피드백** - 챕터 업로드 시 AI 리뷰 생성 상태 표시
- **직관적인 네비게이션** - 대시보드 → 소설 상세 → 챕터 리뷰

## 📊 데이터베이스 스키마

### users
- id, username, email, password, created_at

### novels
- id, user_id, title, description, created_at

### chapters
- id, novel_id, chapter_number, title, content, word_count, created_at

### personas
- id, name, type, description, evaluation_criteria, tone

### ai_reviews
- id, chapter_id, persona_id, review_text, rating, created_at

## ⚠️ 주의사항

1. **OpenAI API 비용**: 챕터를 업로드할 때마다 6개의 AI 페르소나가 리뷰를 생성하므로 OpenAI API 사용량이 발생합니다.

2. **API 키 보안**: `.env` 파일은 절대 git에 커밋하지 마세요. `.gitignore`에 포함되어 있는지 확인하세요.

3. **로컬 개발용**: 현재 설정은 로컬 개발 환경용입니다. 프로덕션 배포 시 추가 보안 설정이 필요합니다.

## 🛠️ 개발 명령어

### Backend
```bash
npm run dev      # 개발 서버 실행 (nodemon)
npm run build    # TypeScript 빌드
npm start        # 프로덕션 서버 실행
```

### Frontend
```bash
npm start        # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm test         # 테스트 실행
```

## 🤝 기여

이 프로젝트는 Boostcamp WM SNU 2025의 일부입니다.

## 📄 라이선스

MIT License

## 📧 문의

문제가 발생하거나 질문이 있으시면 이슈를 등록해주세요.

---

**Happy Writing! ✍️**
