# AWS deployment with Terraform and ECS Fargate

This stack provisions ECR, a VPC with two public subnets, internet gateway, public Application Load Balancer, ECS Fargate cluster/service, CloudWatch log group and security groups.

## Cost and security warning

Applying this stack creates billable resources, including an Application Load Balancer and networking, even when ECS desired task count is zero. Review current AWS pricing before applying. The example listener is HTTP only. Add ACM TLS/HTTPS, restrict ingress, review public networking and complete a security review before production traffic.

## Prerequisites

- AWS account and permission to create VPC, ALB, ECR, ECS, IAM and CloudWatch resources.
- Terraform 1.10+.
- A pre-created encrypted, versioned S3 bucket for Terraform state, with public access blocked and native S3 lock files enabled.
- GitHub OIDC provider and narrowly scoped IAM role.

The bucket must exist before Terraform initialisation. The workflow expects GitHub Environment secrets AWS_ROLE_ARN, AWS_REGION and TF_STATE_BUCKET.

## OIDC trust policy

Create the GitHub OIDC provider for token.actions.githubusercontent.com. Restrict the IAM role trust policy to this repository and the aws-production GitHub Environment. Replace ACCOUNT_ID:

    {
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {"Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"},
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            "token.actions.githubusercontent.com:sub": "repo:JOHNEBSTER-X7/JOHN-EBSTER-DEVELOPER-PORTFOLIO:environment:aws-production"
          }
        }
      }]
    }

Grant only the required Terraform, ECR push and ECS deployment permissions. Do not use AdministratorAccess. Review the precise policy with an AWS administrator.

## Terraform state setup

Create a dedicated S3 bucket. Enable versioning, default encryption and block public access. Terraform uses S3 native state locking.

Local initialisation example:

    terraform init -backend-config="bucket=YOUR_STATE_BUCKET" -backend-config="key=northstar/terraform.tfstate" -backend-config="region=eu-west-2" -backend-config="encrypt=true" -backend-config="use_lockfile=true"
    terraform fmt -check -recursive
    terraform validate
    terraform plan
    terraform apply

The default ECS desired count is zero. Build and push an image to ECR before setting it to one.

## GitHub deployment

The workflow northstar-aws-deploy.yml is manual only and uses the GitHub Environment aws-production. Configure required reviewers on that environment. It assumes AWS credentials through OIDC; no static AWS access key is stored.

The workflow creates the ECR repository, builds and pushes an immutable Git SHA image, then applies the infrastructure and starts one Fargate task.

## Teardown

Run terraform destroy using the same backend and configuration. ECR force deletion is disabled; remove images explicitly before deleting the repository. Verify the AWS account and region before any destructive action.
