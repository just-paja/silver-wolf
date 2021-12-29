locals {
  timestamp = timestamp()
  root_dir = abspath("../")
}

data "archive_file" "source" {
  type = "zip"
  source_dir = "${local.root_dir}/packages/fantasion-web"
  output_path = "/tmp/function-${local.timestamp}.zip"
}

resource "google_storage_bucket" "bucket" {
  name = "${var.project}-artifacts"
  location = var.location
  force_destroy = true
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "zip" {
  name = "source.zip#${data.archive_file.source.output_md5}"
  bucket = google_storage_bucket.bucket.name
  source = data.archive_file.source.output_path
}

resource "google_project_service" "cf" {
  project = var.project
  service = "cloudfunctions.googleapis.com"
}

resource "google_project_service" "cb" {
  project = var.project
  service = "cloudbuild.googleapis.com"
}

resource "google_cloudfunctions_function" "function" {
  name        = var.function_name
  description = var.function_description
  runtime     = var.runtime

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.zip.name
  trigger_http          = true
  entry_point           = var.function_entry_point
}

# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
