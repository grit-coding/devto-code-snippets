# Create Public Subnets in AWS Using Terraform

![Diagram illustrating the AWS infrastructure](https://github.com/grit-coding/DevToCodeSnippets/blob/main/tech-tutorials/infrastructure/terraform/create-public-subnets/images/diagram.png)

This repository, `create-public-subnets`, provides the integrated Terraform source code discussed in our blog post. For an in-depth guide and context, check out: [Building Infrastructure from Scratch: Creating Public Subnets in AWS](https://dev.to/gritcoding/building-infrastructure-from-scratch-creating-public-subnets-in-aws-5c0f).

## Deployment Steps

Follow these steps to deploy your public subnets in AWS using Terraform. Ensure you have Terraform and AWS CLI installed and configured before proceeding.

### Clone and Navigate to the Directory
Clone the repository and navigate to the specific directory:
```bash
git clone https://github.com/grit-coding/DevToCodeSnippets.git
cd DevToCodeSnippets/tech-tutorials/infrastructure/terraform/create-public-subnets
```

### 1. Initialise Terraform and Apply
To initialise Terraform and apply the configuration, execute:
```bash
terraform init
terraform apply -auto-approve
```
When prompted, enter `dev`, `qa`, or `prod` as the environment value.

### 2. Verify Resource Creation
After deployment, verify the creation of resources in your AWS account. Check the VPC, EC2, and IAM sections in the AWS Management Console.

To test the EC2 instance connection:
- Navigate to the EC2 section.
- Click on the created instance and select the `Connect` button.
- Use the Session Manager tab to connect to the instance.

Execute the [following command](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) in the Session Manager to retrieve the instance ID:

```bash
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id
```

### 3. Clean Up
To avoid unnecessary charges, clean up the resources:
```bash
terraform destroy -auto-approve
```
Enter the same environment value as during creation when prompted.

