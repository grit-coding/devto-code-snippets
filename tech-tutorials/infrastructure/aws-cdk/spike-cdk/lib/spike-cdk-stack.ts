import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SpikeCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //level1 and level2 construct of an s3 bucket

    const level1S3Bucket = new CfnBucket(this, 'Level1Bucket', {
      bucketName:'yo-gritcoidng-test-1',
      versioningConfiguration: {
        status: "Enabled"
      }
    })

    const level2S3Bucket = new Bucket(this, "Level2Bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName:'yo-gritcoidng-test-2',
      versioned: true
    })
  }
}
