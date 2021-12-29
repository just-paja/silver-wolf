FROM alpine:3.15

# Copy the sdist archive
COPY dist/fantasion-backend-*.tar.gz /tmp/app.tar.gz

# Install system dependencies
# Install libs to build postresql bindings
# Install the application tarball
# Cleanup after installation
RUN \
  apk add --no-cache --update py-pip jpeg-dev libwebp-dev zlib-dev libjpeg postgresql-libs && \
  apk add --no-cache --virtual .build-deps gcc python3-dev musl-dev postgresql-dev && \
  pip install /tmp/app.tar.gz && \
  rm /tmp/app.tar.gz && \
  apk --purge del .build-deps

# Start Django
EXPOSE 80
CMD gunicorn -c /usr/lib/python3.9/site-packages/fantasion/gunicorn.py fantasion.wsgi
