import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class ClientVpnDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ---------------------------------------------------------------------------
    // VPN CIDR resolution
    // Priority: CDK context → CLIENT_VPN_CIDR env var → default 172.16.0.0/22
    // ---------------------------------------------------------------------------
    const vpnCidr =
      this.node.tryGetContext('clientVpnCidr') ?? process.env.CLIENT_VPN_CIDR ?? '172.16.0.0/22';

    // ---------------------------------------------------------------------------
    // VPC — 10.0.0.0/16, DNS support + hostnames enabled
    //
    // Built with L1 (Cfn) constructs so we get exactly 2 route tables
    // (1 public, 1 private) instead of 1 per subnet. This keeps the AWS Console
    // clean and simple for the video walkthrough — especially when associating
    // route tables with the Client VPN endpoint.
    //
    // NAT Gateways are intentionally omitted to minimize cost. The private EC2
    // instance does not need outbound internet access for this demo.
    // ---------------------------------------------------------------------------
    const vpc = new ec2.CfnVPC(this, 'DemoVpc', {
      cidrBlock: '10.0.0.0/16',
      enableDnsSupport: true,
      enableDnsHostnames: true,
      tags: [{ key: 'Name', value: 'client-vpn-demo-vpc' }],
    });

    // Internet Gateway — required for public subnets
    const igw = new ec2.CfnInternetGateway(this, 'Igw', {
      tags: [{ key: 'Name', value: 'client-vpn-demo-igw' }],
    });
    new ec2.CfnVPCGatewayAttachment(this, 'IgwAttachment', {
      vpcId: vpc.ref,
      internetGatewayId: igw.ref,
    });

    // Get 2 AZs from the stack's region
    const azs = cdk.Fn.getAzs(this.region);
    const az1 = cdk.Fn.select(0, azs);
    const az2 = cdk.Fn.select(1, azs);

    // ---------------------------------------------------------------------------
    // Public subnets (1 per AZ) + shared route table
    // ---------------------------------------------------------------------------
    const publicRt = new ec2.CfnRouteTable(this, 'PublicRt', {
      vpcId: vpc.ref,
      tags: [{ key: 'Name', value: 'client-vpn-demo-public-rt' }],
    });

    new ec2.CfnRoute(this, 'PublicDefaultRoute', {
      routeTableId: publicRt.ref,
      destinationCidrBlock: '0.0.0.0/0',
      gatewayId: igw.ref,
    });

    const publicSubnet1 = new ec2.CfnSubnet(this, 'PublicSubnet1', {
      vpcId: vpc.ref,
      cidrBlock: '10.0.1.0/24',
      availabilityZone: az1,
      mapPublicIpOnLaunch: true,
      tags: [{ key: 'Name', value: 'client-vpn-demo-public-1' }],
    });

    const publicSubnet2 = new ec2.CfnSubnet(this, 'PublicSubnet2', {
      vpcId: vpc.ref,
      cidrBlock: '10.0.2.0/24',
      availabilityZone: az2,
      mapPublicIpOnLaunch: true,
      tags: [{ key: 'Name', value: 'client-vpn-demo-public-2' }],
    });

    new ec2.CfnSubnetRouteTableAssociation(this, 'PublicRtAssoc1', {
      subnetId: publicSubnet1.ref,
      routeTableId: publicRt.ref,
    });

    new ec2.CfnSubnetRouteTableAssociation(this, 'PublicRtAssoc2', {
      subnetId: publicSubnet2.ref,
      routeTableId: publicRt.ref,
    });

    // ---------------------------------------------------------------------------
    // Private subnets (1 per AZ) + shared route table
    // No NAT Gateway — cost optimization for demo. EC2 is accessed via Client VPN.
    // ---------------------------------------------------------------------------
    const privateRt = new ec2.CfnRouteTable(this, 'PrivateRt', {
      vpcId: vpc.ref,
      tags: [{ key: 'Name', value: 'client-vpn-demo-private-rt' }],
    });

    const privateSubnet1 = new ec2.CfnSubnet(this, 'PrivateSubnet1', {
      vpcId: vpc.ref,
      cidrBlock: '10.0.10.0/24',
      availabilityZone: az1,
      mapPublicIpOnLaunch: false,
      tags: [{ key: 'Name', value: 'client-vpn-demo-private-1' }],
    });

    const privateSubnet2 = new ec2.CfnSubnet(this, 'PrivateSubnet2', {
      vpcId: vpc.ref,
      cidrBlock: '10.0.11.0/24',
      availabilityZone: az2,
      mapPublicIpOnLaunch: false,
      tags: [{ key: 'Name', value: 'client-vpn-demo-private-2' }],
    });

    new ec2.CfnSubnetRouteTableAssociation(this, 'PrivateRtAssoc1', {
      subnetId: privateSubnet1.ref,
      routeTableId: privateRt.ref,
    });

    new ec2.CfnSubnetRouteTableAssociation(this, 'PrivateRtAssoc2', {
      subnetId: privateSubnet2.ref,
      routeTableId: privateRt.ref,
    });

    // ---------------------------------------------------------------------------
    // Security Group — allows SSH (22) + HTTP (80) from VPN CIDR only
    // ---------------------------------------------------------------------------
    const sg = new ec2.CfnSecurityGroup(this, 'InstanceSg', {
      vpcId: vpc.ref,
      groupDescription: 'Allow SSH and HTTP from VPN clients only',
      securityGroupIngress: [
        {
          ipProtocol: 'tcp',
          fromPort: 22,
          toPort: 22,
          cidrIp: vpnCidr,
          description: 'SSH from VPN clients',
        },
        {
          ipProtocol: 'tcp',
          fromPort: 80,
          toPort: 80,
          cidrIp: vpnCidr,
          description: 'HTTP from VPN clients',
        },
      ],
      tags: [{ key: 'Name', value: 'client-vpn-demo-sg' }],
    });

    // ---------------------------------------------------------------------------
    // CloudFormation Outputs
    // ---------------------------------------------------------------------------
    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.ref,
      description: 'VPC ID for Client VPN endpoint creation',
    });

    new cdk.CfnOutput(this, 'PublicSubnetIds', {
      value: `${publicSubnet1.ref},${publicSubnet2.ref}`,
      description: 'Public subnet IDs for Client VPN target association',
    });

    new cdk.CfnOutput(this, 'PrivateSubnetIds', {
      value: `${privateSubnet1.ref},${privateSubnet2.ref}`,
      description: 'Private (isolated) subnet IDs',
    });

    new cdk.CfnOutput(this, 'SecurityGroupId', {
      value: sg.attrGroupId,
      description: 'Security group ID for EC2 instance',
    });

    // ---------------------------------------------------------------------------
    // Stack-level tags — propagate to all child resources
    // ---------------------------------------------------------------------------
    cdk.Tags.of(this).add('Project', 'client-vpn-demo');
    cdk.Tags.of(this).add('Purpose', 'youtube-demo');
    cdk.Tags.of(this).add('AutoDelete', 'true');
  }
}
