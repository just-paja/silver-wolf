resource "google_project_service" "sqladmin" {
  service = "sqladmin.googleapis.com"
}

resource "google_sql_database_instance" "master" {
  name = "${var.project}-db"
  region = var.region
  database_version = "POSTGRES_13"
  depends_on = [
    google_project_service.sqladmin
  ]

  settings {
    tier = "db-f1-micro"
    disk_size = 10
    disk_type = "PD_SSD"

    ip_configuration {
      ipv4_enabled = true
      private_network = var.vpc
    }
  }
}

resource "google_sql_database" "database" {
  name = "${var.project}-db"
  instance = google_sql_database_instance.master.name
}

resource "google_sql_user" "user" {
  instance = google_sql_database_instance.master.name
  name = var.db_user
  password = var.db_pass
}
