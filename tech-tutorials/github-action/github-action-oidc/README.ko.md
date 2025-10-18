# GitHub Actions OIDC로 AWS 배포하기

_다른 언어로 읽기: [English](README.md), [한국어](README.ko.md)_

GitHub Actions에서 OIDC (OpenID Connect)를 사용해 AWS에 배포하는 예제입니다. **AWS 시크릿이나 액세스 키 없이도** 안전하게 배포 가능합니다.

## 개요

OIDC를 활용하면 AWS 자격 증명을 GitHub에 저장하지 않고도 안전하게 인증할 수 있습니다. [deploy-to-aws-example.yml](deploy-to-aws-example.yml) 파일을 원하는 프로젝트의 `.github/workflows/` 디렉토리에 복사해서 사용하세요.

## 워크플로우 동작

- OIDC로 AWS 인증 (자격 증명 하드코드나 시크릿 불필요)
- S3 버킷 생성 (예제)
- Pull Request 생성 시 자동 실행 (push나 수동 실행도 가능)
- STS로 AWS 아이덴티티 검증

## 시작하기 전에

**⚠️ 중요:** AWS 계정에 OIDC 프로바이더와 IAM 역할 설정이 먼저 필요합니다.

### 설정 방법

1. **YouTube 튜토리얼 보기** (한국어)
   - 📺 [GitHub Actions OIDC AWS 배포 가이드](https://youtu.be/K6BgWya79-E?si=YjrUtnzZV6mUtbJF)
   - 영상에서 다음 내용을 다룹니다:
     - AWS IAM에 OpenID Connect 프로바이더 만들기
     - GitHub Actions용 IAM 역할 만들고 신뢰 정책 설정하기
     - 필요한 권한 설정하기

2. **AWS에서 설정할 내용:**
   - AWS IAM 콘솔에서 OIDC 프로바이더 생성
   - GitHub를 신뢰하는 IAM 역할 만들기 (예: `github-action-role`)
   - 역할에 필요한 권한 추가 (예: S3 전체 액세스)

## 사용 방법

### 1. 워크플로우 파일 복사하기

[deploy-to-aws-example.yml](deploy-to-aws-example.yml) 파일을 프로젝트에 복사하세요:

```bash
mkdir -p .github/workflows
cp deploy-to-aws-example.yml .github/workflows/
```

### 2. 환경 변수 수정하기

워크플로우 파일을 열어서 환경 변수값을 바꿔줍니다:

```yaml
env:
  AWS_REGION: eu-west-2 # 사용할 AWS 리전
  YOUR_ACCOUNT: 000000000000 # AWS 계정 ID
  BUCKET_NAME: gritcoidng-bucket-test # 만들 버킷 이름 (고유해야 함)
```

### 3. IAM 역할 이름 수정 (필요시)

역할 이름을 다르게 지었다면 30번째 줄도 수정하세요:

```yaml
role-to-assume: arn:aws:iam::${{env.YOUR_ACCOUNT}}:role/github-action-role
```

### 4. 실행 시점 설정

기본 설정으로는 다음 경우에 워크플로우가 실행됩니다:

- `main` 브랜치에 push할 때
- 수동으로 실행할 때

Pull Request 생성 시에도 실행하려면 7번째 줄 주석을 해제하세요:

```yaml
on:
  push:
    branches:
      - main
  pull_request: # 이 줄 주석 해제
  workflow_dispatch:
```

## 워크플로우 분석

```yaml
permissions:
  id-token: write # OIDC 인증에 필요
  contents: read # 코드 체크아웃에 필요
```

워크플로우는:

1. 코드를 체크아웃합니다
2. OIDC를 사용하여 AWS 자격 증명을 구성합니다
3. AWS 아이덴티티를 확인합니다
4. S3 버킷을 생성합니다 (데모용)

## OIDC의 주요 이점

✅ **GitHub에 AWS 시크릿 불필요** - AWS 액세스 키를 저장할 필요 없음
✅ **더 안전함** - 자동 회전되는 임시 자격 증명
✅ **더 나은 규정 준수** - 장기간 유지되는 자격 증명 없음
✅ **더 쉬운 관리** - IAM 역할을 통한 중앙 집중식 액세스 제어

## 문제 해결

- **"Not authorized to perform sts:AssumeRoleWithWebIdentity"**
  → IAM 역할의 신뢰 정책이 GitHub를 OIDC 프로바이더로 허용하는지 확인하세요

- **"Bucket already exists"**
  → `BUCKET_NAME`을 고유한 값으로 변경하세요

- **"Access Denied"**
  → IAM 역할에 필요한 S3 권한이 있는지 확인하세요

## 참고 자료

- 📺 [GitHub Actions OIDC AWS 배포 가이드](https://youtu.be/K6BgWya79-E?si=YjrUtnzZV6mUtbJF)
- 📖 [GitHub 문서: AWS와 OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- 📖 [AWS 문서: IAM OIDC 아이덴티티 프로바이더](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)

## 라이선스

자유롭게 사용하세요!
