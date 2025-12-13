#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { SpikeCdkStack } from '../lib/spike-cdk-stack';
import { SecondStack } from '../lib/seond-stack';

const app = new cdk.App();
new SpikeCdkStack(app, 'SpikeCdkStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

new SecondStack(app, 'development-second-stack')