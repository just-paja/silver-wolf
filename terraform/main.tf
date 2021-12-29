terraform {
  cloud {
    organization = "fantasion"
    workspaces {
      name = "fantasion"
    }
  }
}

locals {
  location = var.GCP_LOCATION
  project = var.GCP_PROJECT
  region = var.GCP_REGION
  repo = var.GCP_DOCKER_REPO
  root_dir = abspath("../")
}

provider "google" {
  project = local.project
  region = local.region
  credentials = var.GCP_CREDENTIALS
}

module "backend_docker" {
  name = "fantasion-backend"
  location = local.location
  path = "${local.root_dir}/packages/fantasion-backend"
  project = local.project
  repo = local.repo
  source = "./modules/docker"
}

module "backend_cloudrun" {
  envs = []
  image_url = module.backend_docker.image_url
  name = "fantasion-backend"
  project = local.project
  region = local.region
  source = "./modules/cloudrun"
  depends_on = [module.backend_docker]
}

module "web_cf" {
  function_description = "Serverless website"
  function_entry_point = "handleRequest"
  function_name = "fantasion-web"
  location = local.location
  project = local.project
  region = local.region
  runtime = var.node_runtime
  source = "./modules/web_cf"
}
