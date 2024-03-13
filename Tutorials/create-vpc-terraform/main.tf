terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "us-east-1"
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

resource "aws_vpc" "main" {
  cidr_block = "10.${lookup(var.env_cidr_map, var.environment, "0")}.0.0/16"
  assign_generated_ipv6_cidr_block = true
}
