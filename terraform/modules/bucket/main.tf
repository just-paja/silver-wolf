resource "google_storage_bucket" "bucket" {
  location = var.location
  name = var.name
  project = var.project
  uniform_bucket_level_access = true
  cors {
    method = ["GET", "HEAD", "OPTIONS"]
    origin = var.origins
  }
}

resource "google_storage_bucket_iam_binding" "public_rule" {
  count = var.public ? 1 : 0
  bucket = google_storage_bucket.bucket.name
  role = "roles/storage.objectViewer"
  members = [
    "allUsers"
  ]
}

output "bucket" {
  value = google_storage_bucket.bucket
}

output "base_url" {
  value = google_storage_bucket.bucket.url
}
