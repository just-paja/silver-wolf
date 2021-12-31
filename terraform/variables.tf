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
  default = "eu.gcr.io"
}

variable "ROOT_DIR" {
  type = string
  default = ""
}

variable "BACKEND_HOSTS" {
  type = string
  default = "api.fantasion.cz"
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
