output "backend_url" {
  value = module.backend_cloudrun.endpoint_url
}

output "frontend_url" {
  value = module.frontend_cloudrun.endpoint_url
}
