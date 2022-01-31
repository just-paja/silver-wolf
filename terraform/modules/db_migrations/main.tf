locals {
  npm = jsondecode(file("${var.path}/package.json"))
}

resource "null_resource" "migrations" {
  triggers = {
    always_run = terraform.workspace == "production" ? local.npm.version : var.revision
  }

  provisioner "local-exec" {
    working_dir = var.path
    environment = {
      DB_HOST: var.db_host,
      DB_NAME: var.db_name,
      DB_PASS: var.db_pass,
      DB_USER: var.db_user,
      SECRET_KEY: var.secret_key,
    }
    command = "npm run migrate"
  }
}
