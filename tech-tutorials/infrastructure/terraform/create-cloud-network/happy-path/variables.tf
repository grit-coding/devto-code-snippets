variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "vpc_name" {
  type    = string
  default = "grit_coding_vpc"
}

variable "environment" {
  description = "The deployment environment (e.g., dev, qa, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "qa", "prod"], var.environment)
    error_message = "The environment must be one of: dev, qa, or prod."
  }
}

variable "env_cidr_map" {
  description = "Map of environment names to CIDR block second octet"
  type        = map(string)
  default = {
    "dev"     = "0"
    "qa"      = "10"
    "prod"    = "20"
  }
}
variable "private_subnets" {
  default = {
    "private_subnet_1" = 1
    "private_subnet_2" = 2
    "private_subnet_3" = 3
  }
}

variable "public_subnets" {
  default = {
    "public_subnet_1" = 1
    "public_subnet_2" = 2
    "public_subnet_3" = 3
  }
}