locals {
  npm = jsondecode(file("${var.path}/package.json"))
}

resource "null_resource" "static_files" {
  triggers = {
    always_run = terraform.workspace == "production" ? local.npm.version : var.revision
  }

  provisioner "local-exec" {
    working_dir = var.path
    environment = {
      BUCKET_PUBLIC: var.bucket_public,
      GCP_PROJECT: var.gcp_project,
      GS_CREDENTIALS: var.gs_credentials,
    }
    command = "npm run collectstatic"
  }
}
