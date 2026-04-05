import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({});

const SNS_TOPIC_ARN = 'YOUR_TOPIC_ARN';

export const handler = async (event) => {
  try {
    const detail = event.detail || {};

    const eventName = detail.eventName || 'Unknown';
    const eventTime = detail.eventTime || 'Unknown';
    const sourceIP = detail.sourceIPAddress || 'Unknown';

    const actor = detail.userIdentity?.arn || 'Unknown';

    const requestParams = detail.requestParameters || {};
    const userName = requestParams.userName || '';
    const groupName = requestParams.groupName || '';
    const policyArn = requestParams.policyArn || '';

    const message = `
        🚨 IAM Alert
        Action: ${eventName}
        Actor: ${actor}
        Time: ${eventTime}
        Source IP: ${sourceIP}

        User: ${userName}
        Group: ${groupName}
        Policy: ${policyArn}`;

    const command = new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Subject: `IAM Alert: ${eventName}`,
      Message: message,
    });

    const response = await sns.send(command);
    console.log('SNS Response:', response);

    return {
      statusCode: 200,
      body: 'Notification sent',
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
