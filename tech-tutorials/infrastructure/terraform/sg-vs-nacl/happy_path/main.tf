provider "aws" {
  region = "us-east-1"
}

data "aws_availability_zones" "available" {}
data "aws_region" "current" {}


resource "aws_vpc" "vpc" {
  cidr_block = "10.${lookup(var.env_cidr_map, var.environment, "0")}.0.0/16"
  assign_generated_ipv6_cidr_block = true

  tags = {
    Name        = var.vpc_name
    Environment = var.environment
    Terraform   = "true"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "grit_coding_igw"
  }
}

resource "aws_subnet" "public_subnets" {
  for_each                = var.public_subnets
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = cidrsubnet(aws_vpc.vpc.cidr_block, 8, each.value)
  availability_zone       = tolist(data.aws_availability_zones.available.names)[each.value]
  map_public_ip_on_launch = true
  assign_ipv6_address_on_creation = true
  ipv6_cidr_block               = cidrsubnet(aws_vpc.vpc.ipv6_cidr_block, 8, each.value)

  tags = {
    Name      = each.key
    Terraform = "true"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    gateway_id     = aws_internet_gateway.internet_gateway.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name      = "grit_coding_public_rtb"
    Terraform = "true"
  }
}


resource "aws_route_table_association" "public" {
  depends_on     = [aws_subnet.public_subnets]
  route_table_id = aws_route_table.public_route_table.id
  for_each       = aws_subnet.public_subnets
  subnet_id      = each.value.id
}


resource "aws_network_acl" "cumstom_nacl_inbound_only" {
  vpc_id = aws_vpc.vpc.id
  subnet_ids = [for s in aws_subnet.public_subnets : s.id]

  tags = {
    Name = "custom_nacl_inbound_only"
  }

  ingress {
    action          = "allow"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_block      = "0.0.0.0/0"
    rule_no         = 100
    icmp_code       = 0
    icmp_type       = 0
  }

  ingress {
    action          = "allow"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    ipv6_cidr_block = "::/0"
    rule_no         = 101
    icmp_code       = 0
    icmp_type       = 0
  }
}

resource "aws_network_acl" "cumstom_nacl_outbound_only" {
  vpc_id = aws_vpc.vpc.id
  subnet_ids = [for s in aws_subnet.public_subnets : s.id]

  tags = {
    Name = "custom_nacl_outbound_only"
  }

  ingress {
    action          = "allow"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_block      = "0.0.0.0/0"
    rule_no         = 100
    icmp_code       = 0
    icmp_type       = 0
  }

  ingress {
    action          = "allow"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    ipv6_cidr_block = "::/0"
    rule_no         = 101
    icmp_code       = 0
    icmp_type       = 0
  }
}


resource "aws_iam_role" "ec2_ssm_role" {
  name = "ec2-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Terraform = "true"
  }
}
resource "aws_iam_role_policy_attachment" "ssm_managed_instance_core" {
  role       = aws_iam_role.ec2_ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_ssm_instance_profile" {
  name = "ec2-ssm-instance-profile"
  role = aws_iam_role.ec2_ssm_role.name
}


resource "aws_security_group" "ec2_sg" {
  name        = "EC2_Instance_SG"
  description = "Security group for EC2 instances with default outbound rules"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_security_group_rule" "ec2_sg_egress_rule" {
  type              = "egress"
  to_port           = 0
  protocol          = "-1"
  from_port         = 0
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.ec2_sg.id
}


resource "aws_instance" "public_instance" {
  for_each                    = aws_subnet.public_subnets
  ami                         = "ami-0c101f26f147fa7fd"
  instance_type               = "t2.micro"
  subnet_id                   = each.value.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  iam_instance_profile        = aws_iam_instance_profile.ec2_ssm_instance_profile.name

  tags = {
    Name      = "Public_Instance_${each.key}"
    Terraform = "true"
  }
}
