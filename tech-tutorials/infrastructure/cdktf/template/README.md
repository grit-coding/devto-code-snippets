# CDKTF Project Template

This is a template for Cloud Development Kit for Terraform (CDKTF) projects. CDKTF allows you to define infrastructure using familiar programming languages instead of HCL.

## Prerequisites

Before you can use this template, you need to install the following tools:

### 1. Node.js

CDKTF requires Node.js version 16.x or later.

**Installation:**

- Download from [nodejs.org](https://nodejs.org/)
- Or use a version manager like [nvm](https://github.com/nvm-sh/nvm):
  ```bash
  nvm install --lts
  nvm use --lts
  ```

**Verify installation:**

```bash
node --version
npm --version
```

### 2. Terraform

Terraform CLI is required as CDKTF generates Terraform configuration files.

**Installation:**

- macOS (using Homebrew):
  ```bash
  brew tap hashicorp/tap
  brew install hashicorp/tap/terraform
  ```
- Other platforms: Download from [terraform.io](https://www.terraform.io/downloads)

**Verify installation:**

```bash
terraform --version
```

### 3. CDKTF CLI

The CDKTF command-line tool for initializing and managing CDKTF projects.

**Installation:**

```bash
npm install -g cdktf-cli
```

**Verify installation:**

```bash
cdktf --version
```

### 4. AWS CLI (for AWS providers)

If you're using AWS as your cloud provider, install the AWS CLI.

**Installation:**

- macOS (using Homebrew):
  ```bash
  brew install awscli
  ```
- Other platforms: Download from [AWS CLI documentation](https://aws.amazon.com/cli/)

**Verify installation:**

```bash
aws --version
```

## Getting Started

1. **Install project dependencies:**

   ```bash
   npm install
   ```

2. **Configure your infrastructure:**
   - Edit the main configuration files to define your infrastructure

3. **Synthesize Terraform configuration:**

   ```bash
   cdktf synth
   ```

4. **Deploy your infrastructure:**

   ```bash
   cdktf deploy
   ```

5. **Destroy resources when done:**
   ```bash
   cdktf destroy
   ```

## Project Structure

```
main.ts           # Main infrastructure definition
cdktf.json        # CDKTF configuration
package.json      # Node.js dependencies
```

## Additional Resources

- [CDKTF Documentation](https://developer.hashicorp.com/terraform/cdktf)
- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
