# AWS deployment activation checklist

- [ ] Create AWS account and choose region.
- [ ] Review AWS pricing and configure a budget alert.
- [ ] Create an S3 Terraform state bucket with versioning, encryption, public access block and native lock files.
- [ ] Configure GitHub OIDC provider in IAM.
- [ ] Create a narrowly scoped IAM role restricted to this repository and the aws-production GitHub Environment.
- [ ] Create GitHub Environment aws-production and configure required reviewers.
- [ ] Add environment secrets AWS_ROLE_ARN, AWS_REGION and TF_STATE_BUCKET.
- [ ] Review the Terraform plan and network/security design.
- [ ] Manually run the GitHub Actions deployment workflow.
- [ ] Verify ECS steady state, ALB health checks and CloudWatch logs.
- [ ] Add ACM TLS/HTTPS, custom domain, WAF, alarms and incident procedures before production traffic.
- [ ] When finished testing, run a reviewed terraform destroy and remove unneeded ECR images.

The workflow creates an internet-facing ALB and networking as well as ECS/ECR/CloudWatch resources. Zero ECS tasks does not make the rest of the stack free. Check current AWS pricing and remove resources when no longer needed.
