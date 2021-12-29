variable "project_version" {
  type = string
  default = "0.0.1"
}

variable "project" {
  type = string
}

variable "location" {
  type = string
  default = "EU"
}

variable "region" {
  type = string
  default = "europe-west3"
}

variable "node_runtime" {
  type = string
  default = "nodejs16"
}

variable "google_credentials" {
  type = string
}

variable "repo" {
  type = string
  default = "eu.gcr.io"
}
