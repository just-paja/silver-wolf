output "endpoint_url" {
  value = google_cloud_run_service.service.status[0].url
}
