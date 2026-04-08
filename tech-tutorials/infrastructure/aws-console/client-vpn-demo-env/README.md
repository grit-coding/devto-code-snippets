# Client VPN 데모 환경

[English](./README.en.md)

[AWS Client VPN](https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html) 데모를 위한 최소 비용 AWS 인프라입니다. L1 (CloudFormation) 구성 요소를 사용하는 단일 CDK 스택으로 퍼블릭/프라이빗 서브넷과 공유 라우팅 테이블이 포함된 VPC를 배포합니다.

배포 후 보안 그룹, EC2 인스턴스, Client VPN 엔드포인트를 수동으로 생성하고 노트북에서 연결합니다. 데모가 끝나면 `cdk destroy`로 기본 인프라를 삭제합니다.

## 생성되는 리소스

| 리소스               | 상세                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| VPC                  | `10.0.0.0/16`, 2개 AZ, DNS 지원 + DNS 호스트네임 활성화              |
| 퍼블릭 서브넷 (×2)   | AZ당 1개 — Client VPN 연결에 필요                                    |
| 프라이빗 서브넷 (×2) | AZ당 1개, 격리됨 (NAT 라우트 없음)                                   |
| 라우팅 테이블 (×2)   | 퍼블릭 1개 (공유), 프라이빗 1개 (공유) — 콘솔에서 깔끔하게 관리      |
| 태그                 | `Project=client-vpn-demo`, `Purpose=youtube-demo`, `AutoDelete=true` |

NAT Gateway, 보안 그룹, EC2 인스턴스, IAM 역할, Client VPN 엔드포인트는 포함되지 않습니다 — 모두 데모 중 수동으로 생성합니다.

## 사전 준비

- [Node.js](https://nodejs.org/) ≥ 18
- [AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) (`npm install -g aws-cdk`)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) (자격 증명 설정 완료)
- VPC, EC2 등 리소스를 생성할 수 있는 권한이 있는 AWS 계정

## 배포

```bash
cd tech-tutorials/infrastructure/aws-console/client-vpn-demo-env

# 의존성 설치
npm install

# 대상 리전 설정 (스택에 리전이 하드코딩되어 있지 않음)
export AWS_DEFAULT_REGION=eu-west-2

# CDK 부트스트랩 (계정/리전당 최초 1회)
cdk bootstrap

# 스택 배포
cdk deploy
```

> **참고:** 스택은 AWS CLI에 설정된 리전에 배포됩니다. `cdk bootstrap`과 `cdk deploy` 실행 전에 `AWS_DEFAULT_REGION`을 설정하거나 AWS 프로필의 기본 리전을 사용하세요.

## 스택 출력값

배포 후 CloudFormation이 다음 출력값을 표시합니다:

| 출력값             | 용도                                 |
| ------------------ | ------------------------------------ |
| `VpcId`            | Client VPN 엔드포인트 생성 시 필요   |
| `PublicSubnetIds`  | Client VPN 대상 네트워크 연결에 필요 |
| `PrivateSubnetIds` | EC2 데모 인스턴스를 실행할 서브넷    |

## 삭제

```bash
cdk destroy
```

> **중요:** `cdk destroy`는 이 스택으로 생성된 리소스만 삭제합니다. 콘솔에서 수동으로 생성한 보안 그룹, EC2 인스턴스, Client VPN 엔드포인트는 **먼저 직접 삭제**해야 합니다.

데모 후 불필요한 과금을 방지하기 위해 모든 리소스를 신속하게 정리하세요.
