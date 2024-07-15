## Deployment Steps

Follow these steps to deploy your public subnets in AWS using Terraform. Ensure you have Terraform and AWS CLI installed and configured before proceeding.

### Clone and Navigate to the Directory
Clone the repository and navigate to the specific directory:
```bash
git clone https://github.com/grit-coding/DevToCodeSnippets.git
cd DevToCodeSnippets/tech-tutorials/infrastructure/terraform/host-static-site-s3-cloudfront-custom-domain
```

### 1. Change Values in custom.tfvars
Before deployment, make sure to add values to the custom.tfvars file. For more details, refer to the
[Blog Post](https://dev.to/gritcoding/hosting-a-static-website-on-s3-bucket-with-cloudfront-and-custom-domain-terraform-23m7-temp-slug-6014446?preview=1e68f210859e1f1ccdb0b1350f0161f54a779702441332ea90c34cc7baa42780eaa9649973cd1578f422cc6520f65c174f934a68439a561345319e89)

### 2. Initialise Terraform and Apply
To initialise Terraform and apply the configuration, execute:
```bash
terraform init
terraform plan
terraform apply -var-file="custom.tfvars"
```

### 3. Verify Resources Creation
Go to the AWS console and upload the index.html file to the bucket you created. Then, open a new tab and access the domain you specified.

example
![result](https://github.com/grit-coding/DevToCodeSnippets/blob/main/tech-tutorials/infrastructure/terraform/host-static-site-s3-cloudfront-custom-domain/images/result.png)

### 4. Clean Up
Empty the S3 bucket, then run the following command:

```bash
terraform destroy -var-file="custom.tfvars"
```

