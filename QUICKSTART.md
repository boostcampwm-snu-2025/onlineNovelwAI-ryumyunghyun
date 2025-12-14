# Quick Start Guide

## 빠른 시작 가이드

### 1단계: 백엔드 설정 및 실행

```bash
# backend 폴더로 이동
cd backend

# 의존성 설치
npm install

# 환경 변수 파일 생성
cp .env.example .env

# .env 파일 편집 (중요!)
# OPENAI_API_KEY를 실제 키로 변경하세요
```

**.env 파일 예시:**
```
PORT=5000
JWT_SECRET=my-super-secret-jwt-key-change-in-production
OPENAI_API_KEY=sk-proj-...your-actual-openai-key...
```

```bash
# 개발 서버 실행
npm run dev
```

서버가 http://localhost:5000 에서 실행됩니다.

### 2단계: 프론트엔드 설정 및 실행

**새 터미널을 열어서:**

```bash
# frontend 폴더로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

브라우저가 자동으로 http://localhost:3000 을 엽니다.

### 3단계: 앱 사용하기

1. **회원가입**
   - "회원가입" 링크 클릭
   - 사용자명, 이메일, 비밀번호 입력
   - "회원가입" 버튼 클릭

2. **첫 소설 작성**
   - 대시보드에서 "새 챕터 작성" 버튼 클릭
   - "새 소설 만들기" 버튼 클릭
   - 소설 제목 입력 (예: "나의 첫 판타지 소설")
   - "소설 생성" 버튼 클릭

3. **첫 챕터 업로드**
   - 챕터 번호: 1
   - 챕터 제목 입력 (예: "프롤로그 - 시작")
   - 챕터 내용 입력 (한국어로 작성)
   - "챕터 업로드" 버튼 클릭

4. **AI 리뷰 확인**
   - 10-30초 정도 대기 (6명의 AI가 리뷰 작성 중)
   - 자동으로 리뷰 페이지로 이동
   - 각 AI 페르소나의 평점과 코멘트 확인

## 문제 해결

### Backend가 실행되지 않는 경우
```bash
# node_modules 삭제 후 재설치
cd backend
rm -rf node_modules
npm install
npm run dev
```

### Frontend가 실행되지 않는 경우
```bash
# node_modules 삭제 후 재설치
cd frontend
rm -rf node_modules
npm install
npm start
```

### OpenAI API 오류
- `.env` 파일에 올바른 API 키가 설정되어 있는지 확인
- OpenAI 계정에 크레딧이 있는지 확인

### CORS 오류
- Backend가 포트 5000에서 실행 중인지 확인
- Frontend의 package.json에 `"proxy": "http://localhost:5000"` 설정 확인

## 개발 팁

### 데이터베이스 초기화
데이터베이스를 초기화하려면:
```bash
cd backend
rm database.sqlite
npm run dev
```
서버가 시작되면 자동으로 새 데이터베이스가 생성됩니다.

### 동시에 두 서버 실행하기 (선택사항)
프로젝트 루트에서 concurrently 사용:
```bash
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm start"
```

---

이제 준비 완료! 🎉
