variable "GCP_PROJECT" {
  type = string
}

variable "GCP_USER" {
  type = string
}

variable "GCP_LOCATION" {
  type = string
  default = "EU"
}

variable "GCP_REGION" {
  type = string
  default = "europe-west1"
}

variable "node_runtime" {
  type = string
  default = "nodejs16"
}

variable "GCP_CREDENTIALS" {
  type = string
}

variable "GCP_DOCKER_REPO" {
  type = string
  default = "fantasion-docker"
}

variable "ROOT_DIR" {
  type = string
  default = ""
}

variable "BACKEND_HOST" {
  type = string
  default = "api.fantasion.cz"
}

variable "FRONTEND_HOST" {
  type = string
  default = "fantasion.cz"
}

variable "PROJECT_ENVIRONMENT" {
  type = string
  default = "production"
}

variable "WEBSITE_URL" {
  type = string
  default = "https://fantasion.cz"
}

variable "DB_USER" {
  type = string
}

variable "DB_PASS" {
  type = string
}

variable "SECRET_KEY" {
  type = string
}

variable "BUCKET_PUBLIC" {
  type = string
}

variable "GS_CREDENTIALS" {
  type = string
}

variable "ADMIN_SSO_CLIENT_ID" {
  type = string
  default = ""
}

variable "ADMIN_SSO_SECRET" {
  type = string
  default = ""
}

variable "ADMIN_SSO_SUPERUSER" {
  type = string
  default = ""
}

variable "EMAIL_ROBOT_HOST" { type = string }
variable "EMAIL_ROBOT_HOST_USER" { type = string }
variable "EMAIL_ROBOT_HOST_PASS" { type = string }

variable "CRON_AUTH" {
  type = string
}
