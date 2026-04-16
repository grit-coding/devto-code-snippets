# 카카오 소셜 로그인 + AWS Cognito 데모

카카오톡 소셜 로그인을 AWS Cognito와 연동하는 방법을 보여주는 React 데모 프로젝트입니다.  
이 프로젝트는 스파이크(spike) 성격으로 만들어졌으며, 유튜브 영상 제작을 위한 통합 데모용입니다.

## 주요 기능

- 카카오 소셜 로그인 (OAuth 2.0 / OIDC)
- 이메일 + 비밀번호 회원가입 / 로그인
- 이메일 인증 코드 확인
- AWS Amplify v6 기반 인증 처리
- Chakra UI v3 기반 UI

## 기술 스택

| 항목        | 버전 |
| ----------- | ---- |
| React       | 19   |
| Vite        | 8    |
| AWS Amplify | 6    |
| Chakra UI   | 3    |

## 사전 준비

### 로컬 개발 환경

아래 도구들이 설치되어 있어야 합니다.

- **Node.js** v18 이상 — [nodejs.org](https://nodejs.org) 에서 다운로드
- **npm** v9 이상 (Node.js 설치 시 함께 포함)
- **Git** — [git-scm.com](https://git-scm.com) 에서 다운로드

버전 확인:

```bash
node -v
npm -v
```

### 카카오 개발자 설정

> ⚠️ **비즈 앱 전환 필수**  
> 카카오 로그인에서 이메일 등 민감 정보 동의 항목을 사용하려면 **비즈 앱으로 전환**이 필요합니다.  
> [카카오 개발자 콘솔](https://developers.kakao.com) > 앱 설정 > 비즈니스 > 비즈 앱 전환 메뉴에서 신청할 수 있습니다.

### AWS 설정

- AWS 계정 및 Cognito 리소스를 생성할 수 있는 IAM 권한 필요

> 카카오 및 Cognito 설정 상세 과정은 유튜브 영상을 참고하세요.

## 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd tech-tutorials/integrations/kakao-cognito-login

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

`.env` 파일을 열고 아래 값을 채워넣습니다:

```env
VITE_USER_POOL_ID=ap-northeast-2_xxxxxxxxx
VITE_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=your-domain.auth.ap-northeast-2.amazoncognito.com
VITE_REDIRECT_SIGN_IN=http://localhost:5173/
VITE_REDIRECT_SIGN_OUT=http://localhost:5173/
```

```bash
# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 동작 흐름

```
사용자 클릭 (카카오로 계속하기)
    ↓
Amplify signInWithRedirect({ provider: { custom: 'Kakao' } })
    ↓
Cognito 호스팅 UI → 카카오 OAuth 인증
    ↓
카카오 로그인 완료 → Cognito로 콜백
    ↓
Cognito가 JWT 토큰 발급
    ↓
앱으로 리다이렉트 → 로그인 완료
```

## 프로젝트 구조

```
src/
├── App.jsx          # 메인 컴포넌트 (로그인/회원가입 UI 및 인증 로직)
├── aws-exports.js   # Amplify 설정 (환경 변수 기반)
├── main.jsx         # 앱 진입점
└── index.css        # 전역 스타일
```

## 참고 사항

- 이 프로젝트는 학습 및 데모 목적으로 만들어졌습니다. 프로덕션 환경에는 적합하지 않습니다.
