variable "hostname" {}
variable "name" {}
variable "project" {}
variable "region" {}

variable "connection_name" {
  type = string
  default = ""
}

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
