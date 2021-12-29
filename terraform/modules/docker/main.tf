locals {
  backend_package = jsondecode(file("${var.path}/package.json"))
}

locals {
  image_url = "${var.repo}/${var.project}/${var.name}:${local.backend_package.version}"
  actor = "docker@${var.project}.iam.gserviceaccount.com"
  root = "terraform@${var.project}.iam.gserviceaccount.com"
}

resource "google_project_service" "container_registry" {
  service = "containerregistry.googleapis.com"
  disable_dependent_services = true
  disable_on_destroy = false
}

resource "google_project_service" "iamcredentials" {
  service = "iamcredentials.googleapis.com"
  disable_dependent_services = true
  disable_on_destroy = false
}

resource "google_service_account_iam_binding" "token-creator-iam" {
    service_account_id = "projects/-/serviceAccounts/${local.actor}"
    role = "roles/iam.serviceAccountTokenCreator"
    members = ["serviceAccount:${local.root}"]
}

data "google_service_account_access_token" "repo" {
  target_service_account = "${local.actor}"
  scopes = ["cloud-platform"]
  lifetime = "300s"
  delegates = ["projects/-/serviceAccounts/${local.root}"]
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
  }
}

output "image_url" {
  value = local.image_url
}
