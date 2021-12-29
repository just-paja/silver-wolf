locals {
  root_dir = abspath("../")
}

provider "google" {
  project = var.project
  region = var.region
}

module "backend_docker" {
  name = "fantasion-backend"
  path = "${local.root_dir}/packages/fantasion-backend"
  project_version = "0.1.0"
  source = "./modules/docker"
}

module "backend_cloudrun" {
  name = "fantasion-backend"
  project = var.project
  region = var.region
  source = "./modules/cloudrun"
}

module "web_cf" {
  source = "./modules/web_cf"
  project = var.project
  region = var.region
  runtime = var.node_runtime
  function_name = "fantasion-web"
  function_description = "Serverless website"
  function_entry_point = "handleRequest"
}
