output "backend_url" {
  value = module.backend_cloudrun.endpoint_url
}

output "web_cf_url" {
  value = module.web_cf.function_url
}
