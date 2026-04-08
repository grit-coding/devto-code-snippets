# Client VPN Demo Environment

Minimal-cost AWS infrastructure for demonstrating [AWS Client VPN](https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html). Deploys a VPC with public and private subnets and shared route tables — all via a single CDK stack using L1 (CloudFormation) constructs.

After deployment you manually create a security group, an EC2 instance, a Client VPN endpoint, and connect from your laptop. When you're done, `cdk destroy` tears down the base infrastructure.

## What Gets Created

| Resource             | Details                                                              |
| -------------------- | -------------------------------------------------------------------- |
| VPC                  | `10.0.0.0/16`, 2 AZs, DNS support + hostnames enabled                |
| Public subnets (×2)  | One per AZ — required for Client VPN association                     |
| Private subnets (×2) | One per AZ, isolated (no NAT route)                                  |
| Route tables (×2)    | 1 public (shared), 1 private (shared) — keeps the console clean      |
| Tags                 | `Project=client-vpn-demo`, `Purpose=youtube-demo`, `AutoDelete=true` |

No NAT Gateway, no security group, no EC2 instance, no IAM roles, no Client VPN endpoint — all created manually during the demo.

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) (`npm install -g aws-cdk`)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured with credentials
- An AWS account with permissions to create VPC, EC2, and related resources

## Deploy

```bash
cd tech-tutorials/infrastructure/aws-console/client-vpn-demo-env

# Install dependencies
npm install

# Set your target region (the stack does not hardcode a region)
export AWS_DEFAULT_REGION=eu-west-2

# Bootstrap CDK (first time only, per account/region)
cdk bootstrap

# Deploy the stack
cdk deploy
```

> **Note:** The stack deploys to whatever region your AWS CLI is configured with. Set `AWS_DEFAULT_REGION` or use your AWS profile's default region before running `cdk bootstrap` and `cdk deploy`.

## Stack Outputs

After deployment, CloudFormation prints these outputs:

| Output             | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `VpcId`            | Needed when creating the Client VPN endpoint     |
| `PublicSubnetIds`  | Needed for Client VPN target-network association |
| `PrivateSubnetIds` | Used to launch the EC2 demo instance             |

## Destroy

```bash
cdk destroy
```

> **Important:** `cdk destroy` removes only the resources created by this stack. If you manually created a security group, EC2 instance, or Client VPN endpoint in the console, **delete those first** — they won't be removed by `cdk destroy`.

Tear down everything promptly after the demo to avoid unexpected charges.
