terraform {
  cloud {
    organization = "fantasion"
    workspaces {
      name = "fantasion"
    }
  }
}

locals {
  gcp_user = var.GCP_USER
  location = var.GCP_LOCATION
  project = var.GCP_PROJECT
  region = var.GCP_REGION
  repo = var.GCP_DOCKER_REPO
  root_dir = abspath("${var.ROOT_DIR == "" ? path.root : var.ROOT_DIR}/..")
}

locals {
  db_name = "${local.project}-db"
}

provider "google" {
  project = local.project
  region = local.region
  credentials = var.GCP_CREDENTIALS
}

module "network" {
  source = "./modules/network"
  project = local.project
}

module "db" {
  db_name = local.db_name
  db_pass = var.DB_PASS
  db_user = var.DB_USER
  depends_on = [module.network]
  project = local.project
  region = local.region
  source = "./modules/db"
  vpc = module.network.vpc
}

module "db_migrations" {
  db_host = module.db.db_instance.public_ip_address
  db_name = local.db_name
  db_pass = var.DB_PASS
  db_user = var.DB_USER
  depends_on = [module.db]
  secret_key = var.SECRET_KEY
  source = "./modules/db_migrations"
  path = "${local.root_dir}/packages/fantasion-backend"
}

module "backend_docker" {
  name = "fantasion-backend"
  location = local.location
  path = "${local.root_dir}/packages/fantasion-backend"
  project = local.project
  repo = local.repo
  source = "./modules/docker"
  user = local.gcp_user
  depends_on = []
}

module "backend_cloudrun" {
  connection_name = module.db.db_instance.connection_name
  envs = [
    {
      name = "ALLOWED_HOSTS",
      value = var.BACKEND_HOST,
    },
    {
      name = "APP_WEBSITE_URL",
      value = var.WEBSITE_URL,
    },
    {
      name = "DB_HOST",
      value = module.db.db_instance.connection_name,
    },
    {
      name = "DB_NAME",
      value = local.db_name,
    },
    {
      name = "DB_PASS",
      value = var.DB_PASS,
    },
    {
      name = "DB_USER",
      value = var.DB_USER,
    },
    {
      name = "PROJECT_ENVIRONMENT",
      value = var.PROJECT_ENVIRONMENT,
    },
    {
      name = "SECRET_KEY",
      value = var.SECRET_KEY,
    },
  ]
  hostname = var.BACKEND_HOST
  image_url = module.backend_docker.image_url
  name = "fantasion-backend"
  project = local.project
  region = local.region
  source = "./modules/cloudrun"
  depends_on = [
    module.db,
    module.backend_docker,
  ]
}

module "web_cf" {
  function_description = "Serverless website"
  function_entry_point = "handleRequest"
  function_name = "fantasion-web"
  location = local.location
  path = "${local.root_dir}/packages/fantasion-web"
  project = local.project
  region = local.region
  runtime = var.node_runtime
  source = "./modules/web_cf"
  depends_on = []
}
