locals {
  npm = jsondecode(file("${var.path}/package.json"))
}

resource "null_resource" "static_files" {
  triggers = {
    always_run = local.npm.version
  }

  provisioner "local-exec" {
    working_dir = var.path
    environment = {
      BUCKET_PUBLIC: var.bucket_public,
      GCP_PROJECT: var.gcp_project,
      GS_CREDENTIALS: var.gs_credentials,
      SECRET_KEY: var.secret_key,
    }
    command = "npm run collectstatic"
  }
}
