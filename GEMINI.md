# 챗봇 서비스 PRD (Product Requirements Document)

## 프로젝트 개요

* **서비스명**: SSAFY 챗봇 서비스
* **목적**: 사용자가 AI 챗봇(gpt-5-nano)과 텍스트 및 이미지 기반 대화를 할 수 있도록 지원하는 반응형 웹 서비스 제공
* **기술 스택**:

  * Frontend: React + TypeScript
  * Styling: Bootstrap 5.3
  * State Management: Redux
  * Backend: Node.js
  * AI API: gpt-5-nano API

---

## 1. 기능 요구 사항

### 1.1 내비게이션 바 (Navbar)

* **구성 요소**:

  * SSAFY 브랜드 로고 (좌측 정렬)
  * 우측 정렬: `채팅`, `로그인`, `회원가입` 버튼

* **동작**:

  * 로고 클릭 시 랜딩 페이지로 이동
  * 채팅 버튼 클릭 시 챗봇 페이지로 이동
  * 로그인 / 회원가입 버튼 클릭 시 각 해당 페이지로 이동

* **디자인 가이드**:

  * 모던한 레이아웃 구성
  * 포인트 컬러: `#00EEFF`
  * Bootstrap 5.3 기반 컴포넌트 사용

---

## 2. 랜딩 페이지

* **소개 내용**: 서비스 개요, 기능 설명, 주요 장점 등 마케팅 목적 콘텐츠 배치
* **내비게이션 링크 포함**: 상단 Navbar 유지

---

## 3. 로그인 / 회원가입 페이지

* **요구 사항**:

  * 이메일, 비밀번호 기반 인증
  * 폼 유효성 검사
  * 반응형 UI 구성
  * 상태 Redux 관리

---

## 4. 채팅 페이지

### 4.1 기본 레이아웃

* **전체 구조**:

  * 상단: 고정된 Navbar
  * 중앙: 채팅 내역 출력 영역
  * 하단: 고정된 입력 영역

* **반응형**: 모든 디바이스에 대응하는 반응형 UI 구현

---

### 4.2 채팅 입력 영역

* **위치**: 화면 하단 고정

* **구성 요소 (좌 → 우 순)**:

  1. 이미지 업로드 버튼 (아이콘 형태)
  2. 프롬프트 텍스트 입력창
  3. 전송 버튼

* **기능 요구 사항**:

  * 이미지 업로드 시 버튼 상단에 이미지 미리보기 출력
  * 이미지 미리보기에 마우스 오버 시 ‘취소’ 버튼 노출 및 삭제 가능
  * 이미지 + 텍스트 조합 입력 가능
  * 전송 시 API 요청 수행 (gpt-5-nano)

---

### 4.3 채팅 내역 출력 영역

* **출력 방식**:

  * 사용자 메시지: 오른쪽 정렬
  * AI 응답: 왼쪽 정렬
  * 각 메시지는 말풍선 UI로 구분
  * 이미지 포함 시 해당 이미지 출력
  * 메시지 간 여백 및 시간 정보 표시(optional)

* **기능 요구 사항**:

  * 스크롤 가능한 채팅 영역
  * 새 메시지 입력 시 자동 스크롤

---

### 4.4 gpt-5-nano API 통신

* **입력 형식**:

  * 텍스트만 입력된 경우: `input_text`만 포함
  * 텍스트 + 이미지 입력된 경우: `input_text`와 `input_image` 모두 포함

* **API 요청 예시**:

```ts
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [{
        role: "user",
        content: [
            { type: "input_text", text: "what's in this image?" },
            {
                type: "input_image",
                image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
            },
        ],
    }],
});

console.log(response.output_text);
```

---

## 5. 상태 관리 (Redux)

* **전역 상태 관리 항목**:

  * 사용자 인증 상태 (로그인 여부, 토큰 등)
  * 채팅 내역 (질문, 응답, 이미지 등)
  * 이미지 업로드 상태
  * 로딩 및 오류 상태

* **기능 구현 시 주의 사항**:

  * 비동기 작업은 Redux Thunk 또는 Toolkit 사용
  * 상태 초기화, 에러 핸들링 명확하게 구분

---

## 6. 디자인 가이드라인

* **기본 폰트**: 시스템 기본 sans-serif 계열
* **포인트 컬러**: `#00EEFF` (버튼, 강조 텍스트 등에 활용)
* **배경 / 텍스트 대비**: 충분한 시각적 구분 제공
* **아이콘 사용**: Bootstrap Icons 활용
* **일관된 spacing 및 margin 적용**

---

## 7. 백엔드 요구 사항 (Node.js)

* **기능 항목**:

  * 사용자 로그인 / 회원가입 API
  * 이미지 업로드 처리 (S3 또는 로컬 저장소)
  * gpt-5-nano API와의 중계 서버 역할
  * 채팅 기록 저장 (선택 사항)

* **보안 고려사항**:

  * JWT 기반 인증
  * CORS 설정
  * API Key 보안 관리

---

## 8. 테스트 및 배포

* **테스트 항목**:

  * UI 반응형 테스트 (모바일, 태블릿, PC)
  * API 통신 테스트
  * 입력 유효성 검사 테스트
  * 이미지 업로드 및 미리보기 테스트

* **배포 환경**:

  * Frontend: Vercel, Netlify 등
  * Backend: Render, Heroku 또는 자체 서버
  * 이미지 저장: AWS S3 또는 Cloudinary 등 외부 스토리지

---

## 9. 향후 확장 고려사항

* 다국어 지원 (한국어/영어)
* 사용자 채팅 로그 조회 기능
* 음성 입력 기능
* 관리자용 챗봇 피드백 분석 페이지

---

**문서 버전**: v1.0
**작성일**: 2025-08-26
**작성자**: 시니어 프로젝트 매니저
