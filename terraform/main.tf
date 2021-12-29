locals {
  root_dir = abspath("../")
}

provider "google" {
  project = var.project
  region = var.region
  credentials = var.google_credentials
}

module "backend_docker" {
  name = "fantasion-backend"
  location = var.location
  path = "${local.root_dir}/packages/fantasion-backend"
  project = var.project
  project_version = "0.1.0"
  source = "./modules/docker"
}

module "web_cf" {
  source = "./modules/web_cf"
  location = var.location
  project = var.project
  region = var.region
  runtime = var.node_runtime
  function_name = "fantasion-web"
  function_description = "Serverless website"
  function_entry_point = "handleRequest"
}
