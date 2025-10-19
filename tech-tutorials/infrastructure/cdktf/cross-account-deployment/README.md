# CDKTF Cross-Account Deployment

This tutorial demonstrates how to deploy AWS infrastructure to a different AWS account using CDKTF (Cloud Development Kit for Terraform). This pattern is commonly used in multi-account AWS architectures where you manage infrastructure from a central account.

## Tutorial Video

A video walkthrough of this tutorial is available in Korean on YouTube: [Link to be added]

## Overview

This setup demonstrates cross-account deployment with the following architecture:

```
[Diagram to be added]
```

**Key Points:**

- **Terraform State Management**: Stored in an S3 bucket in your management account
- **Infrastructure Deployment**: Resources are created in a separate target AWS account
- **Cross-Account Access**: Uses IAM roles for secure cross-account deployment

## Prerequisites

For initial installation and setup of CDKTF, follow the instructions in the [CDKTF Template README](../template/README.md).

Make sure you have:

- Node.js installed
- Terraform CLI installed
- CDKTF CLI installed
- AWS CLI installed and configured

## Setup Instructions

### 1. Install Dependencies

Navigate to this project directory and install the required npm packages:

```bash
npm install
```

### 2. Create S3 Bucket for Terraform State

Create an S3 bucket in your **management account** to store the Terraform state:

```bash
aws s3 mb s3://your-terraform-state-bucket-name --region eu-west-2
```

**Important:** Enable versioning on the bucket for state file protection:

```bash
aws s3api put-bucket-versioning \
  --bucket your-terraform-state-bucket-name \
  --versioning-configuration Status=Enabled
```

### 3. Create IAM Role in Target Account

In your **target AWS account**, create an IAM role that allows the management account to deploy resources.

**Trust Policy** (replace `MANAGEMENT_ACCOUNT_ID` with your management account ID):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::MANAGEMENT_ACCOUNT_ID:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Permissions Policy:**
Attach appropriate permissions based on what you need to deploy. For ECR, you'll need ECR permissions.

### 4. Update Configuration

Update the stack configuration with your specific information:

- **S3 Backend Configuration**: Update with your S3 bucket name and region
- **Target Account Role ARN**: Update with the role ARN from step 3
- **ECR Stack Settings**: Update with your repository names and configurations
- **AWS Region**: Set your preferred deployment region

### 5. Deploy Infrastructure

Synthesize and review the Terraform plan:

```bash
cdktf synth
```

Deploy to the target account:

```bash
cdktf deploy
```

### 6. Verify Deployment

Check the target AWS account to verify that resources were created successfully.

## Cleanup

To destroy all created resources:

```bash
cdktf destroy
```

## Troubleshooting

### Permission Denied Errors

- Verify the IAM role in the target account has the correct trust policy
- Ensure your management account credentials have permission to assume the role

### State File Issues

- Confirm the S3 bucket exists and is accessible
- Check that your AWS credentials have read/write access to the state bucket

## Additional Resources

- [CDKTF Documentation](https://developer.hashicorp.com/terraform/cdktf)
- [Terraform Remote State](https://developer.hashicorp.com/terraform/language/state/remote)
