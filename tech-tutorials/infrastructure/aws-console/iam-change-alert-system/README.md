# IAM Change Alert System

Automated alert system using CloudTrail, EventBridge, Lambda, and SNS to get notified when IAM changes occur.

This example uses IAM changes, but the same architecture can be extended to other AWS services like EC2, S3, etc.

📺 Follow along with the [YouTube video](https://youtu.be/8O9sqVFd96g) for the full walkthrough. | 🇰🇷 [한국어 README](./README.ko.md)

## Architecture Flow

```
IAM Change → CloudTrail Logs → EventBridge Rule Match → Lambda Execution → SNS Notification
```

## Files

| File                        | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| `event-bridge-pattern.json` | Event pattern for the EventBridge rule                  |
| `lambda-code-example.js`    | Lambda function code (sends alert via SNS)              |
| `lambda-role.json`          | IAM policy for the Lambda role (SNS Publish permission) |
| `test-pattern.json`         | Sample event for testing the EventBridge rule           |

## Detected IAM Events

- `CreateUser` / `DeleteUser`
- `CreateGroup` / `DeleteGroup`
- `AddUserToGroup` / `RemoveUserFromGroup`
- `AttachGroupPolicy` / `DetachGroupPolicy`
- `PutGroupPolicy` / `DeleteGroupPolicy`

## References

- [CloudTrail Event Reference](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference.html)
- [EventBridge Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)
