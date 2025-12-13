import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SecondStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //level1 and level2 construct of an s3 bucket

    const thirdBucket = new CfnBucket(this, 'Level1Bucket', {
      bucketName:'yo-gritcoidng-test-3',
      versioningConfiguration: {
        status: "Enabled"
      }
    })

  }
}
