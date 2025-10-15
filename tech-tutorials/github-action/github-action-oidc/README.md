# GitHub Actions OIDC AWS Deployment Example

*Read this in other languages: [English](README.md), [한국어](README.ko.md)*

This repository demonstrates how to deploy to AWS using GitHub Actions with OIDC (OpenID Connect) authentication - **no AWS secrets or access keys required!**

## Overview

This workflow example shows you how to securely authenticate with AWS using OIDC federation. You can copy the [deploy-to-aws-example.yml](deploy-to-aws-example.yml) file to your own project's `.github/workflows/` directory.

## What This Workflow Does

- Authenticates to AWS using OIDC (no hardcoded credentials)
- Creates an example S3 bucket
- Triggers when a pull request is opened (or on push/manual trigger)
- Verifies AWS identity using STS

## Prerequisites

**� Important:** Before using this workflow, you must set up the OIDC provider and IAM role in your AWS account.

### Setup Steps

1. **Follow the YouTube Tutorial** (Korean)
   - =� [YouTube Video Link - Placeholder]
   - This video guides you through:
     - Creating an OpenID Connect provider in AWS IAM
     - Creating an IAM role with trust policy for GitHub Actions
     - Configuring the necessary permissions

2. **AWS Configuration Required:**
   - Create an OIDC provider in AWS IAM Console
   - Create an IAM role (e.g., `github-action-role`) with trust relationship to GitHub
   - Attach necessary permissions (e.g., S3 full access) to the role

## Usage

### 1. Copy the Workflow File

Copy [deploy-to-aws-example.yml](deploy-to-aws-example.yml) to your project:

```bash
mkdir -p .github/workflows
cp deploy-to-aws-example.yml .github/workflows/
```

### 2. Update Environment Variables

Edit the workflow file and update these environment variables:

```yaml
env:
  AWS_REGION: eu-west-2              # Change to your AWS region
  YOUR_ACCOUNT: 000000000000         # Change to your AWS account ID
  BUCKET_NAME: gritcoidng-bucket-test # Change to your desired bucket name
```

### 3. Update IAM Role Name (if different)

If you used a different role name, update line 30:

```yaml
role-to-assume: arn:aws:iam::${{env.YOUR_ACCOUNT}}:role/github-action-role
```

### 4. Configure Trigger Events

By default, the workflow triggers on:
- Push to `main` branch
- Manual workflow dispatch

To trigger on pull requests, uncomment line 7:

```yaml
on:
  push:
    branches:
      - main
  pull_request:  # Uncomment this line
  workflow_dispatch:
```

## Workflow Breakdown

```yaml
permissions:
  id-token: write # Required for OIDC authentication
  contents: read  # Required to checkout code
```

The workflow:
1. Checks out your code
2. Configures AWS credentials using OIDC
3. Verifies the AWS identity
4. Creates an S3 bucket (as a demonstration)

## Key Benefits of OIDC

 **No AWS secrets in GitHub** - No need to store AWS access keys
 **More secure** - Temporary credentials with automatic rotation
 **Better compliance** - No long-lived credentials
 **Easier management** - Centralized access control through IAM roles

## Troubleshooting

- **"Not authorized to perform sts:AssumeRoleWithWebIdentity"**
  � Check your IAM role's trust policy allows GitHub as OIDC provider

- **"Bucket already exists"**
  � Change the `BUCKET_NAME` to a unique value

- **"Access Denied"**
  � Verify your IAM role has the necessary S3 permissions

## Resources

- =� [Setup Tutorial (Korean) - Placeholder]
- =� [GitHub Docs: OIDC with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- =� [AWS Docs: IAM OIDC Identity Providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)

## License

Feel free to use this example for your own projects!
