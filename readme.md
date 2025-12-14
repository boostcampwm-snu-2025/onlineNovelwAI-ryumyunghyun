# 온라인 소설 with AI - 프로젝트 문서

AI 독자 페르소나가 자동으로 리뷰를 작성하는 웹소설 플랫폼

## 목차
- [프로젝트 개요](#프로젝트-개요)
- [데모](#데모)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시스템 아키텍처](#시스템-아키텍처)
- [데이터 흐름](#데이터-흐름)
- [주요 기능](#주요-기능)
- [설치 및 실행](#설치-및-실행)
- [API 명세](#api-명세)
- [데이터베이스 스키마](#데이터베이스-스키마)
- [보안 고려사항](#보안-고려사항)

## 프로젝트 개요
웹소설 작가들이 초기에 독자를 모으고 피드백을 받기 어려운 문제를 해결하기 위해, **6명의 AI 독자 페르소나**가 자동으로 챕터를 읽고 평가하는 플랫폼입니다.

### 서비스 목적
- 초보 작가에게 즉각적인 피드백 제공
- 다양한 관점의 리뷰를 통한 작품 개선

### 핵심가치
- 유저가 쓴 글을 AI가 각각의 페르소나를 가지고 평가/리뷰 남긴다
- 올라온 소설 내용을 기억하고 각각의 AI가 평가한다
- 변화하는 지표를 유저가 확인할 수 있다

### Painpoint
- 직접 소설을 써야한다

### Wowpoint
- 평가가 우상향할 경우 재미가 있다
- AI가 과거 글들을 기억하고 댓글을 남긴다

## 데모
![데모480](https://github.com/user-attachments/assets/61cfb56d-116b-4b3c-aaf8-2240ea67e1aa)





## 기술 스택

### Backend
- **런타임**: Node.js + TypeScript
- **프레임워크**: Express.js
- **데이터베이스**: SQLite3
- **AI**: OpenAI API (GPT-4 / GPT-3.5-turbo)
- **인증**: JWT (JSON Web Token)
- **암호화**: bcrypt

### Frontend
- **프레임워크**: React 18 + TypeScript
- **라우팅**: React Router v6
- **HTTP 클라이언트**: Axios
- **상태 관리**: React Context API
- **스타일링**: Inline Styles (CSS-in-JS)

## 프로젝트 구조

```
onlineNovelwAI-ryumyunghyun/
│
├── backend/                           # 백엔드 서버
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts           # SQLite 데이터베이스 초기화
│   │   │
│   │   ├── controllers/              # 비즈니스 로직 컨트롤러
│   │   │   ├── authController.ts     # 회원가입/로그인
│   │   │   └── novelController.ts    # 소설/챕터 CRUD + AI 리뷰 생성
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.ts               # JWT 인증 미들웨어
│   │   │
│   │   ├── routes/                   # API 라우트 정의
│   │   │   ├── auth.ts               # /api/auth/*
│   │   │   └── novel.ts              # /api/novels/*, /api/chapters/*
│   │   │
│   │   ├── services/                 # 외부 서비스 연동
│   │   │   └── ai/
│   │   │       ├── contextService.ts # 페르소나 & 이전 챕터 조회
│   │   │       └── openaiService.ts  # OpenAI API 호출
│   │   │
│   │   └── index.ts                  # 서버 진입점
│   │
│   ├── .env                          # 환경 변수 (API 키 등)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                          # 프론트엔드 앱
│   ├── public/
│   │   └── index.html                # HTML 템플릿
│   │
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # 인증 상태 관리 Context
│   │   │
│   │   ├── pages/                    # 페이지 컴포넌트
│   │   │   ├── Login.tsx             # 로그인 페이지
│   │   │   ├── Register.tsx          # 회원가입 페이지
│   │   │   ├── Dashboard.tsx         # 대시보드 (소설 목록)
│   │   │   ├── UploadStory.tsx       # 챕터 업로드
│   │   │   ├── NovelDetail.tsx       # 소설 상세 (챕터 목록)
│   │   │   └── ChapterReviews.tsx    # 챕터 & AI 리뷰 보기
│   │   │
│   │   ├── services/                 # API 통신 서비스
│   │   │   ├── api.ts                # Axios 인스턴스 (인터셉터 설정)
│   │   │   ├── authService.ts        # 인증 API
│   │   │   └── novelService.ts       # 소설/챕터 API
│   │   │
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript 타입 정의
│   │   │
│   │   ├── App.tsx                   # 메인 앱 (라우팅 설정)
│   │   ├── index.tsx                 # React 진입점
│   │   └── index.css                 # 글로벌 스타일
│   │
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                          # 이 문서
```

## 시스템 아키텍처

### 전체 구조도

```
┌─────────────────┐
│   사용자        │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│  ┌──────────────────────────────────┐  │
│  │  Pages (로그인/대시보드/업로드)   │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
│  ┌──────────▼───────────────────────┐  │
│  │  Services (API 통신)             │  │
│  │  - authService                   │  │
│  │  - novelService                  │  │
│  └──────────┬───────────────────────┘  │
│             │ Axios                     │
└─────────────┼───────────────────────────┘
              │ HTTP (proxy: :5000)
              ▼
┌─────────────────────────────────────────┐
│         Backend (Express)               │
│  ┌──────────────────────────────────┐  │
│  │  Routes → Middleware → Controllers│ │
│  └──────────┬───────────────────────┘  │
│             │                           │
│  ┌──────────▼───────────────────────┐  │
│  │  Controllers                     │  │
│  │  - authController (회원가입/로그인)│ │
│  │  - novelController (CRUD)        │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
│  ┌──────────▼───────────────────────┐  │
│  │  Services                        │  │
│  │  - contextService (DB 조회)      │  │
│  │  - openaiService (AI 리뷰 생성)  │  │
│  └──────────┬───────────────────────┘  │
│             │                           │
└─────────────┼───────────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌────────┐        ┌────────────┐
│SQLite  │        │OpenAI API  │
│Database│        │(GPT-4)     │
└────────┘        └────────────┘
```

## 데이터 흐름

### 1. 사용자 인증 흐름

```
[사용자] → [회원가입/로그인 페이지]
              ↓
        [authService.register/login]
              ↓
        POST /api/auth/register or /api/auth/login
              ↓
        [authController] → bcrypt 암호화 → SQLite
              ↓
        JWT 토큰 생성 및 반환
              ↓
        localStorage 저장 + AuthContext 업데이트
              ↓
        [대시보드로 리다이렉트]
```

### 2. 챕터 업로드 & AI 리뷰 생성 흐름

```
[사용자] → [UploadStory 페이지]
              ↓
        폼 입력 (소설 선택, 챕터 번호, 제목, 내용)
              ↓
        [novelService.createChapter]
              ↓
        POST /api/chapters (JWT 토큰 포함)
              ↓
        [authMiddleware] JWT 검증 → userId 추출
              ↓
        [novelController.createChapter]
              ↓
        ┌─────────────────────────────────────┐
        │ 1. 소설 소유권 확인 (DB)            │
        │ 2. 챕터 INSERT                      │
        │ 3. getAllPersonas() - 6개 페르소나  │
        │ 4. getPreviousChapters() - 컨텍스트│
        └─────────────────────────────────────┘
              ↓
        [openaiService.generateReview] x 6회 (병렬)
              ↓
        각 페르소나별 시스템 프롬프트 생성
              ↓
        OpenAI API 호출 (GPT-3.5 or GPT-4)
              ↓
        AI 리뷰 텍스트 + 평점 (1-10) 추출
              ↓
        ai_reviews 테이블에 6개 리뷰 INSERT
              ↓
        [ChapterReviews 페이지로 리다이렉트]
              ↓
        GET /api/chapters/:id
              ↓
        챕터 내용 + 6개 AI 리뷰 화면에 표시
```

### 3. 소설 관리 흐름

```
[대시보드]
    ↓
GET /api/novels (내 소설 목록 조회)
    ↓
[소설 카드 클릭]
    ↓
GET /api/novels/:id (소설 상세 + 챕터 목록)
    ↓
[NovelDetail 페이지]
    ↓
    ├─ [챕터 추가] → UploadStory
    ├─ [챕터 수정] → PUT /api/chapters/:id
    ├─ [챕터 삭제] → DELETE /api/chapters/:id
    ├─ [소설 수정] → PUT /api/novels/:id
    └─ [소설 삭제] → DELETE /api/novels/:id
```

## 주요 기능

### 1. 인증 시스템
- **회원가입**: bcrypt를 이용한 비밀번호 암호화
- **로그인**: JWT 토큰 발급 (7일 유효)
- **자동 로그인**: localStorage에 토큰 저장
- **보호된 라우트**: authMiddleware로 API 접근 제어

### 2. 소설 관리 (CRUD)
- **생성**: 새 소설 프로젝트 생성
- **조회**: 
  - 내 소설 목록 (챕터 수 포함)
  - 소설 상세 정보 + 챕터 목록
- **수정**: 소설 제목/설명 수정
- **삭제**: 소설 삭제 

### 3. 챕터 관리 (CRUD)
- **생성**: 
  - 챕터 업로드
  - 자동 글자 수 계산
  - **AI 리뷰 자동 생성 (6개 페르소나)**
- **조회**: 챕터 내용 + AI 리뷰 목록
- **수정**: 챕터 제목/내용 수정
- **삭제**: 챕터 삭제 (관련 리뷰 CASCADE 삭제)

### 4. AI 리뷰 시스템

#### AI 독자 페르소나 (6종)
1. **캐주얼 독자** 📖 - 재미와 몰입도 중심
2. **문학 평론가** 🎓 - 문학적 가치와 서사 구조
3. **장르 팬** ⭐ - 장르 문법과 독창성
4. **편집자** ✏️ - 맞춤법, 문법, 가독성
5. **상업 출판인** 💼 - 시장성과 상업적 잠재력
6. **창작 작가 동료** 🤝 - 격려와 창작 과정 지원

#### 페르소나별 평가 기준
| 페르소나 | 평가 항목 | 톤 |
|---------|---------|-----|
| 캐주얼 독자 | 흥미도, 가독성, 공감도 | 친근하고 솔직 |
| 문학 평론가 | 문체, 주제의식, 서사 구조 | 격식있고 학술적 |
| 장르 팬 | 장르 컨벤션, 클리셰 활용 | 열정적, 비교 분석적 |
| 편집자 | 맞춤법, 문법, 문장 구조 | 객관적, 실무적 |
| 상업 출판인 | 시장성, 상업성, 타겟 독자 | 비즈니스 지향적 |
| 창작 작가 동료 | 창작 과정, 의도, 기술적 도전 | 따뜻하고 지지적 |

#### AI 모델 선택 로직
```typescript
const model = chapterContent.length < 1000 
  ? 'gpt-3.5-turbo'  // 짧은 챕터
  : 'gpt-4';          // 긴 챕터
```

#### 컨텍스트 제공
- **이전 챕터 내용**: 연재물의 경우 이전 챕터들의 요약 제공
- **페르소나별 시스템 프롬프트**: 각 AI의 성격과 평가 기준 반영

#### 리뷰 형식
```
## 장점
[구체적인 장점 2-3개]

## 개선점
[구체적인 개선점 2-3개]

## 종합평가
[전체적인 평가와 격려]

평점: [1-10점]
```

## 설치 및 실행

### 사전 요구사항
- Node.js 18 이상
- npm 또는 yarn
- OpenAI API 키

### 1. 레포지토리 클론

```bash
git clone https://github.com/boostcampwm-snu-2025/onlineNovelwAI-ryumyunghyun.git
cd onlineNovelwAI-ryumyunghyun
```

### 2. Backend 설정

```bash
cd backend
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 OPENAI_API_KEY 입력

# 개발 서버 실행
npm run dev
```

**`.env` 파일 예시:**
```env
PORT=5000
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-...your-openai-api-key
```

### 3. Frontend 설정

```bash
cd frontend
npm install

# 개발 서버 실행
npm start
```

### 4. 접속
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## API 명세

### 인증 API

#### POST /api/auth/register
회원가입

**Request:**
```json
{
  "username": "홍길동",
  "email": "hong@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "회원가입 성공",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "홍길동",
    "email": "hong@example.com"
  }
}
```

#### POST /api/auth/login
로그인

**Request:**
```json
{
  "email": "hong@example.com",
  "password": "password123"
}
```

**Response:** (회원가입과 동일)

---

### 소설 API

#### POST /api/novels
소설 생성 (인증 필요)

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "나의 첫 판타지 소설",
  "description": "용사의 모험 이야기"
}
```

**Response:**
```json
{
  "message": "소설이 생성되었습니다",
  "novel": {
    "id": 1,
    "title": "나의 첫 판타지 소설",
    "description": "용사의 모험 이야기"
  }
}
```

#### GET /api/novels
내 소설 목록 조회 (인증 필요)

**Response:**
```json
{
  "novels": [
    {
      "id": 1,
      "user_id": 1,
      "title": "나의 첫 판타지 소설",
      "description": "용사의 모험 이야기",
      "created_at": "2024-01-01T00:00:00.000Z",
      "chapter_count": 5
    }
  ]
}
```

#### GET /api/novels/:id
소설 상세 조회 (인증 필요)

**Response:**
```json
{
  "novel": {
    "id": 1,
    "title": "나의 첫 판타지 소설",
    "description": "용사의 모험 이야기",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "chapters": [
    {
      "id": 1,
      "novel_id": 1,
      "chapter_number": 1,
      "title": "프롤로그",
      "content": "...",
      "word_count": 1523,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### PUT /api/novels/:id
소설 수정 (인증 필요)

**Request:**
```json
{
  "title": "수정된 제목",
  "description": "수정된 설명"
}
```

#### DELETE /api/novels/:id
소설 삭제 (인증 필요)

**Response:**
```json
{
  "message": "소설이 삭제되었습니다"
}
```

---

### 챕터 API

#### POST /api/chapters
챕터 생성 + AI 리뷰 자동 생성 (인증 필요)

**Request:**
```json
{
  "novelId": 1,
  "chapterNumber": 1,
  "title": "프롤로그",
  "content": "옛날 옛적에..."
}
```

**Response:**
```json
{
  "message": "챕터가 생성되고 AI 리뷰가 생성되었습니다",
  "chapter": {
    "id": 1,
    "chapterNumber": 1,
    "title": "프롤로그"
  }
}
```

**⚠️ 참고:** 이 API는 6개의 AI 리뷰를 자동으로 생성하므로 응답 시간이 **10-30초** 소요될 수 있습니다.

#### GET /api/chapters/:id
챕터 & AI 리뷰 조회 (인증 필요)

**Response:**
```json
{
  "chapter": {
    "id": 1,
    "novel_id": 1,
    "chapter_number": 1,
    "title": "프롤로그",
    "content": "...",
    "word_count": 1523,
    "created_at": "2024-01-01T00:00:00.000Z",
    "novel_title": "나의 첫 판타지 소설"
  },
  "reviews": [
    {
      "id": 1,
      "chapter_id": 1,
      "persona_id": 1,
      "persona_name": "캐주얼 독자",
      "persona_type": "casual-reader",
      "review_text": "## 장점\n...\n## 개선점\n...",
      "rating": 8,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### PUT /api/chapters/:id
챕터 수정 (인증 필요)

**Request:**
```json
{
  "title": "수정된 제목",
  "content": "수정된 내용..."
}
```

**Response:**
```json
{
  "message": "챕터가 수정되었습니다",
  "chapter": {
    "id": 1,
    "title": "수정된 제목",
    "wordCount": 2000
  }
}
```

#### DELETE /api/chapters/:id
챕터 삭제 (인증 필요)

**Response:**
```json
{
  "message": "챕터가 삭제되었습니다"
}
```

## 데이터베이스 스키마

### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### novels
```sql
CREATE TABLE novels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### chapters
```sql
CREATE TABLE chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  novel_id INTEGER NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (novel_id) REFERENCES novels(id) ON DELETE CASCADE,
  UNIQUE(novel_id, chapter_number)
);
```

### personas
```sql
CREATE TABLE personas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  evaluation_criteria TEXT NOT NULL,
  tone TEXT NOT NULL
);
```

**기본 데이터 (6개 페르소나):**
1. 캐주얼 독자 (casual-reader)
2. 문학 평론가 (literary-critic)
3. 장르 팬 (genre-enthusiast)
4. 편집자 (editor)
5. 상업 출판인 (commercial-publisher)
6. 창작 작가 동료 (fellow-writer)

### ai_reviews
```sql
CREATE TABLE ai_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  persona_id INTEGER NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  FOREIGN KEY (persona_id) REFERENCES personas(id)
);
```

## 보안 고려사항

### Backend
- **비밀번호 암호화**: bcrypt (salt rounds: 10)
- **JWT 토큰**: 7일 유효기간, HS256 알고리즘
- **환경 변수**: `.env` 파일로 민감 정보 관리 (API 키, JWT 시크릿)
- **소유권 검증**: 모든 CRUD 작업에서 `user_id` 확인
- **SQL Injection 방지**: 파라미터화된 쿼리 사용

### Frontend
- **토큰 저장**: localStorage (XSS 주의)
- **자동 로그아웃**: 401 응답 시 토큰 삭제 및 로그인 페이지 리다이렉트
- **보호된 라우트**: AuthContext를 통한 인증 검증
- **CORS 설정**: 프록시를 통한 백엔드 통신

## 주의사항

### OpenAI API 비용
- 챕터 업로드 시 **6개의 AI 페르소나**가 동시에 리뷰를 생성합니다.
- **짧은 챕터(<1000자)**: GPT-3.5-turbo 사용
- **긴 챕터(≥1000자)**: GPT-4 사용
- **예상 비용**: 챕터당 약 **$0.1-0.5** (GPT-4 사용 시 더 높음)
- 대량 테스트 시 API 비용에 유의하세요.

### 개발 환경
- 현재 설정은 **로컬 개발 환경**용입니다.
- **프로덕션 배포 시** 고려사항:
  - HTTPS 적용
  - CORS 설정 강화
  - 환경 변수 관리 (AWS Secrets Manager 등)
  - 데이터베이스를 PostgreSQL/MySQL로 변경 권장
  - 로깅 및 모니터링 시스템 구축
  - Rate Limiting 적용

### 성능 최적화
- AI 리뷰 생성은 **비동기 병렬 처리**로 속도 최적화
- 긴 챕터의 경우 응답 시간이 길어질 수 있음
- 프로덕션 환경에서는 **메시지 큐**(Redis, RabbitMQ)를 사용한 백그라운드 작업 권장
