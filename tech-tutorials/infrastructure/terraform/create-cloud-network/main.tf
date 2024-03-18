
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

resource "aws_subnet" "private_subnets" {
  for_each          = var.private_subnets
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = cidrsubnet(aws_vpc.vpc.cidr_block, 8, each.value)
  availability_zone = tolist(data.aws_availability_zones.available.names)[each.value]

  tags = {
    Name      = each.key
    Terraform = "true"
  }
}

resource "aws_subnet" "public_subnets" {
  for_each                = var.public_subnets
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = cidrsubnet(aws_vpc.vpc.cidr_block, 8, each.value + 100)
  availability_zone       = tolist(data.aws_availability_zones.available.names)[each.value]
  map_public_ip_on_launch = true

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

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name      = "grit_coding_private_rtb"
    Terraform = "true"
  }
}


resource "aws_route_table_association" "public" {
  depends_on     = [aws_subnet.public_subnets]
  route_table_id = aws_route_table.public_route_table.id
  for_each       = aws_subnet.public_subnets
  subnet_id      = each.value.id
}

resource "aws_route_table_association" "private" {
  depends_on     = [aws_subnet.private_subnets]
  route_table_id = aws_route_table.private_route_table.id
  for_each       = aws_subnet.private_subnets
  subnet_id      = each.value.id
}


resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "grit_coding_igw"
  }
}

resource "aws_network_acl" "public_nacl" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name        = "grit_coding_public_nacl"
    Terraform   = "true"
  }
}

resource "aws_network_acl_rule" "public_nacl_rule_ingress" {
  network_acl_id = aws_network_acl.public_nacl.id
  rule_number    = 100
  egress         = false
  protocol       = "tcp"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 80
  to_port        = 80
}
resource "aws_network_acl_rule" "public_nacl_rule_ingress_ipv6" {
  network_acl_id = aws_network_acl.public_nacl.id
  rule_number    = 200
  egress         = false
  protocol       = "tcp"
  rule_action    = "allow"
  ipv6_cidr_block = "::/0"
  from_port      = 80
  to_port        = 80
}

resource "aws_network_acl_rule" "public_nacl_rule_egress" {
  network_acl_id = aws_network_acl.public_nacl.id
  rule_number    = 100
  egress         = true
  protocol       = "tcp"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 0
  to_port        = 0
}

resource "aws_network_acl_rule" "public_nacl_rule_egress_ipv6" {
  network_acl_id = aws_network_acl.public_nacl.id
  rule_number    = 200
  egress         = true
  protocol       = "tcp"
  rule_action    = "allow"
  ipv6_cidr_block = "::/0"
  from_port      = 0
  to_port        = 0
}

resource "aws_network_acl" "private_nacl" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name      = "grit_coding_private_nacl"
    Terraform = "true"
  }
}

resource "aws_network_acl_rule" "private_nacl_rule_ingress" {
  network_acl_id = aws_network_acl.private_nacl.id
  rule_number    = 100
  egress         = false
  protocol       = "tcp"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 80
  to_port        = 80
}

resource "aws_network_acl_rule" "private_nacl_rule_ingress_ipv6" {
  network_acl_id = aws_network_acl.private_nacl.id
  rule_number    = 200
  egress         = false
  protocol       = "tcp"
  rule_action    = "allow"
  ipv6_cidr_block = "::/0"
  from_port      = 80
  to_port        = 80
}

resource "aws_network_acl_rule" "private_nacl_rule_egress" {
  network_acl_id = aws_network_acl.private_nacl.id
  rule_number    = 100
  egress         = true
  protocol       = "tcp"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 0
  to_port        = 0
}

resource "aws_network_acl_rule" "private_nacl_rule_egress_ipv6" {
  network_acl_id = aws_network_acl.private_nacl.id
  rule_number    = 200
  egress         = true
  protocol       = "tcp"
  rule_action    = "allow"
  ipv6_cidr_block = "::/0"
  from_port      = 0
  to_port        = 0
}


resource "aws_network_acl_association" "public_subnet_association" {
  for_each       = aws_subnet.public_subnets
  network_acl_id = aws_network_acl.public_nacl.id
  subnet_id      = each.value.id
}

resource "aws_network_acl_association" "private_subnet_association" {
  for_each       = aws_subnet.private_subnets
  network_acl_id = aws_network_acl.private_nacl.id
  subnet_id      = each.value.id
}
