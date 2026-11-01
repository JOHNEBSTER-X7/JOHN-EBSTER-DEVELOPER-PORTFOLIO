variable "aws_region" {
  type    = string
  default = "eu-west-2"
}
variable "project_name" {
  type    = string
  default = "northstar-cloud-platform"
}
variable "environment" {
  type    = string
  default = "production"
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging or production."
  }
}
variable "desired_count" {
  type        = number
  default     = 0
  description = "ECS task count. Zero pauses the application tasks."
}
variable "image_tag" {
  type    = string
  default = "latest"
}
variable "container_port" {
  type    = number
  default = 3400
}
variable "health_check_path" {
  type    = string
  default = "/api/health"
}
variable "vpc_cidr" {
  type    = string
  default = "10.42.0.0/16"
}
variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.42.1.0/24", "10.42.2.0/24"]
}
variable "task_cpu" {
  type    = number
  default = 256
}
variable "task_memory" {
  type    = number
  default = 512
}
