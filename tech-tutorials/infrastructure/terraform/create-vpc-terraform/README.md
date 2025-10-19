# Create a VPC Using Terraform on AWS

![flow chart](https://github.com/grit-coding/DevToCodeSnippets/blob/main/tech-tutorials/infrastructure/terraform/create-vpc-terraform/images/terraform-vpc.png)

This guide describes the process of creating a Virtual Private Cloud (VPC) in AWS using Terraform.

## Prerequisites

Before you start, make sure you have the following installed and configured:

- The [Terraform CLI (1.2.0+)](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).
- The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
- AWS account and associated credentials with permissions to create resources.

## Configuration

Set up your AWS credentials by exporting the following environment variables with your actual AWS credentials:

```bash
export AWS_ACCESS_KEY_ID=yourAccessKeyID
export AWS_SECRET_ACCESS_KEY=yourSecretAccessKey
export AWS_DEFAULT_REGION=yourAWSRegion
```

## Setting Up the Terraform Configuration

The `main.tf` file in your `create-vpc-terraform` project defines the Terraform configuration. This file specifies the AWS provider, required Terraform version, and the resources, including the VPC, to be created.

## Deployment Steps

1. **Initialise Terraform**

   Run the following command in your project directory to initialise Terraform.

   ```bash
   terraform init
   ```

2. **Apply the Terraform Configuration**

   Apply the Terraform configuration to create the VPC in AWS. This will prompt you for confirmation before creating any resources.

   ```bash
   terraform apply
   ```

   When prompted, enter `dev`, `qa`, or `prod` for the environment value. Confirm the action by entering `yes`.

   If you provide an incorrect environment value, it will throw an error.
   ![validation](https://github.com/grit-coding/DevToCodeSnippets/blob/main/tech-tutorials/infrastructure/terraform/create-vpc-terraform/images/validation.gif)

3. **Verify VPC Creation**

   In the AWS Console, navigate to the VPC section in the region specified in your main.tf file to confirm the VPC has been created with the correct CIDR block.

4. **Clean Up Resources**

   To delete the VPC and clean up the resources when they are no longer needed, use the following command:

   ```bash
   terraform destroy
   ```

   Confirm the action by entering `yes`.
   This command will remove all resources created by Terraform in this configuration.

## Additional Information

This guide focuses on the basics of creating a VPC in AWS using Terraform. For more detailed information, refer to the [Terraform documentation](https://developer.hashicorp.com/terraform/docs) or a related [blog post](https://dev.to/gritcoding/building-infrastructure-from-scratch-creating-a-vpc-with-terraform-2hmc).
