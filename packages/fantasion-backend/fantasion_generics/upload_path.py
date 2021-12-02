def get_upload_path(instance, filename):
    return '{0}/%Y/%m/%d/{1}'.format(
        instance.get_upload_dir(),
        filename
    )
