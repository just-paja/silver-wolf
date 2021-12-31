variable "connection_name" {}
variable "hostname" {}
variable "name" {}
variable "project" {}
variable "region" {}

variable "image_url" {
  type = string
}

variable "protocol" {
  type = string
  default = "https"
}

variable "envs" {
  type = list(object({
    name = string
    value = string
  }))
}

variable "auth" {
  type = bool
  default = false
}
