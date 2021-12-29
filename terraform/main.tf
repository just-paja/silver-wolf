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
  project_version = var.project_version
  repo = var.repo
  source = "./modules/docker"
}

module "backend_cloudrun" {
  envs = []
  image_url = module.backend_docker.image_url
  name = "fantasion-backend"
  project = var.project
  region = var.region
  source = "./modules/cloudrun"
  depends_on = [module.backend_docker]
}

module "web_cf" {
  function_description = "Serverless website"
  function_entry_point = "handleRequest"
  function_name = "fantasion-web"
  location = var.location
  project = var.project
  region = var.region
  runtime = var.node_runtime
  source = "./modules/web_cf"
}
