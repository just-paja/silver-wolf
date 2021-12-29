variable "GCP_PROJECT" {
  type = string
}

variable "GCP_LOCATION" {
  type = string
  default = "EU"
}

variable "GCP_REGION" {
  type = string
  default = "europe-west3"
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
