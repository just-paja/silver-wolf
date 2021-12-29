resource "docker_image" "image" {
  name = var.name
  build {
    path = var.path
    tag = ["${var.name}:${var.project_version}"]
  }
}
