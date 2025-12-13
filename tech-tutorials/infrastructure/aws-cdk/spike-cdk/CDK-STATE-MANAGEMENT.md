# CDK State Management

## How CDK Tracks CloudFormation State

Unlike Terraform which uses local state files, CDK is **stateless** on the local machine. The source of truth is always the CloudFormation stack deployed in AWS.

## The Process

### 1. `cdk synth` (Synthesis)
- Runs **locally only**
- Executes your CDK code
- Generates CloudFormation template in `cdk.out/`
- **No AWS interaction**
- No comparison happens

### 2. `cdk diff` (Comparison)
- Synthesizes template locally
- **Calls AWS CloudFormation API** to fetch current deployed stack
- Compares local template vs deployed template
- Shows what would change

### 3. `cdk deploy` (Deployment)
- Synthesizes template locally
- Fetches current stack from AWS
- Shows changes and asks for confirmation
- Executes CloudFormation stack update

## Example Scenario

**Developer A creates a bucket:**
```typescript
const bucket = new Bucket(this, "MyBucket", {
  bucketName: 'original-bucket-name',
  versioned: true
})
```
- Runs `cdk deploy`
- CloudFormation stack created in AWS

**Developer B clones repo and changes bucket name:**
```typescript
const bucket = new Bucket(this, "MyBucket", {
  bucketName: 'new-bucket-name',  // Changed!
  versioned: true
})
```
- Runs `cdk diff`
- CDK will:
  1. Use Developer B's AWS credentials
  2. Call `DescribeStacks` API to fetch current CloudFormation stack
  3. Compare local template with deployed template
  4. Show that bucket name changed (requires replacement)

## How CDK Identifies the Stack

CDK uses the **stack name** (e.g., `'SpikeCdkStack'`) to identify which CloudFormation stack to fetch from AWS.

See `bin/spike-cdk.ts`:
```typescript
new SpikeCdkStack(app, 'SpikeCdkStack', { ... });
//                     ^^^^^^^^^^^^^^^^ This is the stack name
```

## Requirements for Multiple Developers

For Developer B to compare/deploy changes, they need:
- AWS credentials configured (`~/.aws/credentials` or environment variables)
- Access to the same AWS account and region where the stack was deployed
- Proper IAM permissions to read/update CloudFormation stacks

## Key Differences from Terraform

| Feature | CDK | Terraform |
|---------|-----|-----------|
| State Storage | AWS CloudFormation (remote) | Local `.tfstate` file |
| State Sharing | Automatic via AWS | Requires remote backend setup |
| Source of Truth | CloudFormation stack in AWS | State file |
| State Drift | CloudFormation handles it | Requires `terraform refresh` |

## Concurrent Deployments: What Happens When Two Developers Deploy Simultaneously?

CloudFormation has **built-in locking** to prevent concurrent modifications to the same stack.

### Scenario: Developer A and Developer B both run `cdk deploy` at the same time

**Timeline:**

1. **Developer A** runs `cdk deploy` at 10:00:00
   - CloudFormation stack status changes to `UPDATE_IN_PROGRESS`
   - CloudFormation **locks the stack**

2. **Developer B** runs `cdk deploy` at 10:00:05 (5 seconds later)
   - CDK attempts to update the same stack
   - CloudFormation returns an error: `Stack is in UPDATE_IN_PROGRESS state and cannot be updated`
   - **Developer B's deployment fails immediately**

3. **Developer A's deployment** continues
   - Completes successfully
   - Stack status changes to `UPDATE_COMPLETE`
   - Lock is released

4. **Developer B must retry**
   - Run `cdk deploy` again
   - This time CloudFormation will accept the update
   - **But Developer B's changes will overwrite Developer A's changes!**

### Error Message Example

When Developer B tries to deploy while Developer A's deployment is in progress:

```
❌ Deployment failed: Error: Stack SpikeCdkStack is in UPDATE_IN_PROGRESS state and cannot be updated.
```

### The Problem: Last Writer Wins

```
Developer A's code:        Developer B's code:
bucketName: 'bucket-a'     bucketName: 'bucket-b'
        ↓                          ↓
    Deploys first             Deploys second
        ✅                          ✅
                                    ↓
                    Final result: 'bucket-b'
                    (Developer A's change is lost!)
```

### Best Practices to Avoid Conflicts

1. **Use CI/CD Pipeline**
   - Only deploy from a central CI/CD system (GitHub Actions, Jenkins, etc.)
   - Developers push code, pipeline deploys
   - Ensures sequential deployments

2. **Communication**
   - Use team chat to coordinate deployments
   - "I'm deploying to dev now"

3. **Separate Environments**
   - Each developer has their own stack for testing
   ```typescript
   const stackName = `MyStack-${process.env.USER}`;
   new MyStack(app, stackName);
   ```

4. **Pull Before Deploy**
   - Always `git pull` latest changes before deploying
   - Reduces chance of conflicting changes

5. **Use Stack Policies** (Advanced)
   - Protect critical resources from being modified
   - Requires extra approval for sensitive changes

### CloudFormation Stack States

When a stack is in these states, deployments will fail:

- `CREATE_IN_PROGRESS`
- `UPDATE_IN_PROGRESS`
- `DELETE_IN_PROGRESS`
- `ROLLBACK_IN_PROGRESS`
- `UPDATE_ROLLBACK_IN_PROGRESS`

You must wait until the stack reaches a stable state:
- `CREATE_COMPLETE`
- `UPDATE_COMPLETE`
- `UPDATE_ROLLBACK_COMPLETE`

## Important Notes

### Dangerous Changes
Changing certain properties like bucket names will cause resource replacement:
```
[-] AWS::S3::Bucket MyBucket destroy
[+] AWS::S3::Bucket MyBucket create
```

This would **delete the old bucket** (and all its data!) and create a new one.

### No Local State File
CDK doesn't maintain local state. The `cdk.out/` directory contains:
- Synthesized CloudFormation templates
- Asset manifests
- Metadata

These are **generated files**, not state. You can delete `cdk.out/` anytime and regenerate with `cdk synth`.

## References

- [AWS CDK Developer Guide - Stacks](https://docs.aws.amazon.com/cdk/v2/guide/stacks.html)
- [CloudFormation Concepts](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-whatis-concepts.html)
- [CDK Diff Documentation](https://docs.aws.amazon.com/cdk/v2/guide/cli.html#cli-diff)
