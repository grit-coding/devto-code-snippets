#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClientVpnDemoStack } from '../lib/client-vpn-demo-stack';

const app = new cdk.App();
new ClientVpnDemoStack(app, 'ClientVpnDemoStack', {
  description: 'VPC + private EC2 instance for AWS Client VPN demo (youtube-demo)',
});
