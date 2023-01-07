terraform {
  backend "gcs" {
    bucket = "fantasion-terraform-state"
    prefix = "terraform/state"
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

data "external" "git_checkout" {
  program = ["${path.module}/get_sha.sh"]
}

locals {
  db_name = "${local.project}-db-${terraform.workspace}"
  revision = data.external.git_checkout.result.sha
  image_base_url = "${local.repo}/${local.project}"
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
  revision = local.revision
  secret_key = var.SECRET_KEY
  source = "./modules/db_migrations"
  path = "${local.root_dir}/packages/fantasion-backend"
}

module "backend_storage_public" {
  name = var.BUCKET_PUBLIC
  location = local.location
  project = local.project
  origins = [
    "https://${var.BACKEND_HOST}",
    var.WEBSITE_URL
  ]
  source = "./modules/bucket"
}

module "backend_static_files" {
  bucket_public = var.BUCKET_PUBLIC
  depends_on = [module.backend_storage_public]
  gcp_project = local.project
  gs_credentials = var.GS_CREDENTIALS
  path = "${local.root_dir}/packages/fantasion-backend"
  revision = local.revision
  secret_key = var.SECRET_KEY
  source = "./modules/django_static_files"
}

module "frontend_static_files" {
  bucket_public = var.BUCKET_PUBLIC
  depends_on = [module.backend_storage_public]
  gcp_project = local.project
  gs_credentials = var.GS_CREDENTIALS
  path = "${local.root_dir}/packages/fantasion-web"
  revision = local.revision
  source = "./modules/next_static_files"
}


module "backend_cloudrun" {
  connection_name = module.db.db_instance.connection_name
  envs = [
    {
      name = "ADMIN_SSO_CLIENT_ID",
      value = var.ADMIN_SSO_CLIENT_ID,
    },
    {
      name = "ADMIN_SSO_SECRET",
      value = var.ADMIN_SSO_SECRET,
    },
    {
      name = "ADMIN_SSO_SUPERUSER",
      value = var.ADMIN_SSO_SUPERUSER,
    },
    {
      name = "ALLOWED_HOSTS",
      value = var.BACKEND_HOST,
    },
    {
      name = "APP_WEBSITE_URL",
      value = var.WEBSITE_URL,
    },
    {
      name = "BUCKET_PUBLIC",
      value = var.BUCKET_PUBLIC,
    },
    {
      name = "DB_HOST",
      value = "/cloudsql/${module.db.db_instance.connection_name}",
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
      name = "EMAIL_ROBOT_HOST",
      value = var.EMAIL_ROBOT_HOST,
    },
    {
      name = "EMAIL_ROBOT_HOST_PASS",
      value = var.EMAIL_ROBOT_HOST_PASS,
    },
    {
      name = "EMAIL_ROBOT_HOST_USER",
      value = var.EMAIL_ROBOT_HOST_USER,
    },
    {
      name = "DB_USER",
      value = var.DB_USER,
    },
    {
      name = "GCP_PROJECT",
      value = local.project,
    },
    {
      name = "GS_CREDENTIALS",
      value = var.GS_CREDENTIALS,
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
  image_base_url = local.image_base_url
  name = "fantasion-backend-${terraform.workspace}"
  path = "${local.root_dir}/packages/fantasion-backend"
  project = local.project
  region = local.region
  revision = local.revision
  source = "./modules/cloudrun"
  depends_on = [
    module.db,
    module.backend_storage_public,
  ]
}

module "frontend_cloudrun" {
  envs = [
    {
      name = "API_URL",
      value = "https://${var.BACKEND_HOST}/api/v1",
    },
    {
      name = "NEXT_TELEMETRY_DISABLED",
      value = 1,
    },
    {
      name = "NODE_ENV",
      value = "production",
    },
    {
      name = "FRONTEND_HOST",
      value = var.FRONTEND_HOST,
    },
    {
      name = "STATIC_ROOT",
      value = "https://storage.googleapis.com/${var.BUCKET_PUBLIC}"
    },
  ]
  hostname = var.FRONTEND_HOST
  image_base_url = local.image_base_url
  name = "fantasion-frontend-${terraform.workspace}"
  path = "${local.root_dir}/packages/fantasion-web"
  project = local.project
  region = local.region
  revision = local.revision
  source = "./modules/cloudrun"
}

resource "google_cloud_scheduler_job" "bank_sync" {
  attempt_deadline = "60s"
  description = "Sync payments with the banks"
  name = "bank-sync-${terraform.workspace}"
  schedule = terraform.workspace == "production" ? "*/5 * * * *" : "*/30 * * * *"
  time_zone = "Europe/Prague"

  http_target {
    http_method = "PUT"
    uri = "https://${var.BACKEND_HOST}/api/v1/accounts/sync"
    headers = {
      "Authorization": "Basic ${var.CRON_AUTH}"
    }
  }
}
