locals {
  npm = jsondecode(file("${var.path}/package.json"))
  user_domain = "${var.project}.iam.gserviceaccount.com"
  user_prefix = "projects/-/serviceAccounts"
  image_prefix = "${var.repo}/${var.project}/${var.name}-${terraform.workspace}"
}

locals {
  image_url = terraform.workspace == "production" ? "${local.image_prefix}:${local.npm.version}" : "${local.image_prefix}:${var.revision}"
  actor = "${var.actor}@${local.user_domain}"
  root = "${var.user}@${local.user_domain}"
}

resource "google_project_service" "containerregistry" {
  service = "containerregistry.googleapis.com"
}

resource "google_project_service" "iamcredentials" {
  service = "iamcredentials.googleapis.com"
}

resource "google_service_account_iam_binding" "token-creator-iam" {
  service_account_id = "${local.user_prefix}/${local.actor}"
  role = "roles/iam.serviceAccountTokenCreator"
  members = ["serviceAccount:${local.root}"]
}

data "google_service_account_access_token" "repo" {
  target_service_account = "${local.actor}"
  scopes = ["cloud-platform"]
  lifetime = "600s"
  delegates = ["${local.user_prefix}/${local.root}"]
}

provider "docker" {
  registry_auth {
    address = var.repo
    username = "oauth2accesstoken"
    password = data.google_service_account_access_token.repo.access_token
  }
}

resource "docker_registry_image" "image" {
  name = local.image_url
  insecure_skip_verify = true
  build {
    context = var.path
    labels = {
      revision = var.revision,
      version = local.npm.version,
    }
  }
}

output "image_url" {
  value = local.image_url
}
