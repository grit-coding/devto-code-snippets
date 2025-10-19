import { Construct } from 'constructs';
import { S3Backend, TerraformOutput, TerraformStack } from 'cdktf';
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { Region } from '../types/region';
import { S3StateBucket } from '../types/s3-bucket';
import { EcrRepository } from '@cdktf/provider-aws/lib/ecr-repository';

export class EcrStack extends TerraformStack {
  constructor(
    scope: Construct,
    id: string,
    options: {
      s3StateBucket: S3StateBucket;
      s3ObjectKey: string;
      region: Region;
      projectPrefix: string;
      ecrName: string;
      targetAccNumber: number;
      assumeRoleName: string;
    }
  ) {
    super(scope, id);

    new S3Backend(this, {
      bucket: options.s3StateBucket,
      key: options.s3ObjectKey,
      region: options.region,
    }).addOverride('use_lockfile', true); //https://github.com/hashicorp/terraform-cdk/issues/3834#issuecomment-2715730340

    const provider = new AwsProvider(this, 'aws-provider', {
      region: options.region,
      assumeRole: [
        {
          roleArn: `arn:aws:iam::${options.targetAccNumber}:role/${options.assumeRoleName}`,
          sessionName: options.assumeRoleName,
        },
      ],
      defaultTags: [
        {
          tags: {
            Owner: options.projectPrefix,
            DeployedBy: 'Terraform',
          },
        },
      ],
    });

    // Define ECR Repository
    const ecr = new EcrRepository(this, 'ecr-repo', {
      provider,
      name: options.ecrName,
      imageScanningConfiguration: {
        scanOnPush: true,
      },
      imageTagMutability: 'MUTABLE',
    });

    new TerraformOutput(this, 'ecr-repo-url', {
      value: ecr.repositoryUrl,
    });
  }
}
