import { App } from 'cdktf';
import { EcrStack } from './stacks/ecr-stack';

const app = new App();
const keyPrefix = 'your-prefix'; // prefix for tfstate file

const sharedConfig = {
  s3StateBucket: 'your-bucket-name' as const, // bucket and dynamodb are created ahead in each aws account
  profile: 'grit-coding-terraform',
  env: 'demo',
  region: 'eu-west-2' as const,
  projectPrefix: 'demo-infra',
};

//cdktf apply ecr-demo-stack
new EcrStack(app, 'ecr-demo-stack', {
  s3ObjectKey: `${keyPrefix}/ecr-stack.tfstate`,
  ecrName: 'gritcoding-demo-ecr',
  targetAccNumber: 12345678910, //your account number
  assumeRoleName: '', //your assume role name
  ...sharedConfig,
});

app.synth();
