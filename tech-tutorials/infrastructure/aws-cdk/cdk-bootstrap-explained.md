# Understanding CDK Bootstrap and the Asset Bucket

When you run `cdk bootstrap`, AWS CDK creates infrastructure in your AWS account to support CDK deployments. The most important component is the **CDK asset bucket**.

## What is the CDK Bootstrap Bucket?

The bootstrap bucket is an S3 bucket that serves as a **staging area for deployment assets**. It stores files and resources that are too large to include directly in CloudFormation templates.

### Bucket Naming Convention

```
cdk-hnb659fds-assets-{ACCOUNT_ID}-{REGION}
```

- `cdk-hnb659fds` - A hash prefix to avoid naming conflicts
- `{ACCOUNT_ID}` - Your AWS account number
- `{REGION}` - The AWS region (e.g., us-east-1)

Example: `cdk-hnb659fds-assets-123456789012-us-east-1`

## What Does the Bucket Store?

### 1. Lambda Function Code

When you define a Lambda function with local code:

```typescript
new lambda.Function(this, 'MyFunction', {
  code: lambda.Code.fromAsset('./lambda'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X,
});
```

**What happens:**
1. CDK zips your Lambda code
2. Uploads the zip file to the bootstrap bucket
3. CloudFormation references the S3 location when creating the Lambda function

### 2. Docker Container Images

For containerized applications (Lambda containers, ECS, Fargate):

```typescript
new lambda.DockerImageFunction(this, 'MyDockerFunction', {
  code: lambda.DockerImageCode.fromImageAsset('./docker-app'),
});
```

**What happens:**
1. CDK builds your Docker image
2. Pushes it to the bootstrap ECR repository (also created during bootstrap)
3. The image is referenced from ECR during deployment

### 3. Large CloudFormation Templates

CloudFormation templates have a **51,200 byte size limit** when passed directly.

**What happens:**
- If your synthesized template exceeds this limit, CDK stores it in the bucket
- CloudFormation retrieves the template from S3 during deployment

### 4. File Assets

Any files you want to deploy as part of your infrastructure:

```typescript
// Deploy website files to S3
new s3deploy.BucketDeployment(this, 'DeployWebsite', {
  sources: [s3deploy.Source.asset('./website')],
  destinationBucket: websiteBucket,
});
```

**What happens:**
1. CDK uploads your files to the bootstrap bucket
2. A Lambda function copies them to the destination bucket during deployment

### 5. Custom Resources

Assets required by custom resources or CDK constructs that need file storage during deployment.

## The Deployment Workflow

```
┌─────────────────┐
│  cdk synth      │  Identifies assets needed
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  cdk deploy     │  Uploads assets to bootstrap bucket
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CloudFormation  │  Retrieves assets from bucket
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Creates/Updates │  Deploys your infrastructure
│  AWS Resources  │
└─────────────────┘
```

## Why Is the Bucket Retained?

When you delete the CDKToolkit stack, the bootstrap bucket is typically **retained** (not automatically deleted). Here's why:

### 1. Prevents Breaking Existing Stacks
- Your deployed CDK stacks reference assets in this bucket
- Deleting it would break updates or rollbacks to those stacks

### 2. Preserves Deployment History
- The bucket contains versioned copies of all deployed assets
- This history is needed for CloudFormation rollbacks

### 3. Manual Control
- Gives you explicit control over when to delete deployment artifacts
- Prevents accidental data loss

## Bootstrap Bucket Lifecycle

### Initial Bootstrap
```bash
cdk bootstrap
```
Creates:
- CDKToolkit CloudFormation stack
- S3 bucket for assets
- ECR repository for container images
- IAM roles for deployment
- SSM parameters for configuration

### Multiple Projects
- **All CDK projects** in the same account/region share the same bootstrap bucket
- Assets from different projects coexist in the same bucket
- Assets are uniquely identified by content hash

### Cleanup Process

If you want to completely remove CDK bootstrap resources:

```bash
# 1. Delete all your CDK application stacks first
cdk destroy

# 2. Delete the CDKToolkit stack
aws cloudformation delete-stack --stack-name CDKToolkit

# 3. Manually empty and delete the S3 bucket
aws s3 rm s3://cdk-hnb659fds-assets-ACCOUNT-REGION --recursive
aws s3 rb s3://cdk-hnb659fds-assets-ACCOUNT-REGION

# 4. Delete the ECR repository (if using Docker)
aws ecr delete-repository --repository-name cdk-hnb659fds-container-assets-ACCOUNT-REGION --force
```

## Scope: Account + Region

The bootstrap bucket is scoped to a specific **AWS account and region combination**:

| Account | Region | Bootstrap Needed? |
|---------|--------|-------------------|
| Account A | us-east-1 | Yes (once) |
| Account A | us-west-2 | Yes (once) |
| Account B | us-east-1 | Yes (once) |

### Example: Multi-Region Setup

```bash
# Bootstrap US East
cdk bootstrap aws://123456789012/us-east-1

# Bootstrap US West (separate bucket created)
cdk bootstrap aws://123456789012/us-west-2

# Bootstrap EU (separate bucket created)
cdk bootstrap aws://123456789012/eu-west-1
```

Each region gets its own:
- Bootstrap bucket
- ECR repository
- IAM roles
- CDKToolkit stack

## Cost Considerations

### Storage Costs
- S3 storage charges apply for all assets
- Older assets remain unless you implement lifecycle policies

### Best Practices for Cost Management

1. **Implement lifecycle policies** to automatically delete old assets:
```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket cdk-hnb659fds-assets-ACCOUNT-REGION \
  --lifecycle-configuration file://lifecycle.json
```

2. **Periodic cleanup** of unused assets:
```bash
# Review bucket contents
aws s3 ls s3://cdk-hnb659fds-assets-ACCOUNT-REGION --recursive

# Delete specific old assets
aws s3 rm s3://cdk-hnb659fds-assets-ACCOUNT-REGION/old-asset-hash
```

3. **Monitor bucket size**:
```bash
aws s3 ls s3://cdk-hnb659fds-assets-ACCOUNT-REGION --recursive --summarize
```

## Security Features

The bootstrap bucket includes several security measures:

- **Encryption**: Server-side encryption enabled by default
- **Versioning**: Enabled to support rollbacks
- **Access Control**: Restricted to CDK deployment roles only
- **Block Public Access**: All public access blocked

## Troubleshooting

### Error: "Asset with hash X not found"
- The asset was deleted from the bucket
- Re-deploy the stack to re-upload the asset

### Error: "Access Denied" during deployment
- CDK deployment role lacks permissions
- May need to re-bootstrap with updated permissions

### Bucket filling up with old assets
- Implement S3 lifecycle policies
- Manually clean up old deployments you no longer need

## Summary

The CDK bootstrap bucket is:
- ✅ **Shared** across all CDK projects in an account/region
- ✅ **Essential** for deploying CDK applications
- ✅ **Persistent** to support existing stacks and rollbacks
- ✅ **Automatically managed** by CDK during deployments
- ✅ **Safe to delete** only when all CDK stacks are removed

Think of it as the **deployment staging area** that bridges the gap between your local CDK code and AWS CloudFormation's deployment process.
