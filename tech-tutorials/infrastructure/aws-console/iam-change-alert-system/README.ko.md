# IAM 변경 알림 시스템

CloudTrail, EventBridge, Lambda, SNS를 활용하여 IAM 변경이 발생했을 때 자동으로 알림을 받는 구조입니다.

IAM 변경을 예제로 사용하지만, 이 구조는 EC2, S3 등 다양한 AWS 서비스에도 그대로 확장할 수 있습니다.

📺 [YouTube 영상](https://youtu.be/8O9sqVFd96g)에서 전체 구현 과정을 확인할 수 있습니다.

## 아키텍처 흐름

```
IAM 변경 발생 → CloudTrail 기록 → EventBridge 규칙 매칭 → Lambda 실행 → SNS 알림 발송
```

## 파일 설명

| 파일                        | 설명                                        |
| --------------------------- | ------------------------------------------- |
| `event-bridge-pattern.json` | EventBridge 규칙에 사용할 이벤트 패턴       |
| `lambda-code-example.js`    | Lambda 함수 코드 (SNS로 알림 발송)          |
| `lambda-role.json`          | Lambda에 부여할 IAM 정책 (SNS Publish 권한) |
| `test-pattern.json`         | EventBridge 규칙 테스트용 샘플 이벤트       |

## 감지되는 IAM 이벤트

- `CreateUser` / `DeleteUser`
- `CreateGroup` / `DeleteGroup`
- `AddUserToGroup` / `RemoveUserFromGroup`
- `AttachGroupPolicy` / `DetachGroupPolicy`
- `PutGroupPolicy` / `DeleteGroupPolicy`

## 참고

- [CloudTrail 이벤트 레퍼런스](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference.html)
- [EventBridge 이벤트 패턴](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)
