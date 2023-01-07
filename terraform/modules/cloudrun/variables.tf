variable "hostname" { type = string }
variable "image_base_url" { type = string }
variable "name" { type = string }
variable "path" { type = string }
variable "project" { type = string }
variable "region" { type = string }
variable "revision" { type = string }

variable "connection_name" {
  type = string
  default = ""
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
