provider "google" {
  project = var.project
  region = var.region
}

module "web_cf" {
  source = "./modules/web_cf"
  project = var.project
  region = var.region
  runtime = var.node_runtime
  function_name = "fantasion-web"
  function_description = "Serverless website"
  function_entry_point = "handleRequest"
}
