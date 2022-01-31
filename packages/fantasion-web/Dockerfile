FROM alpine:3.15

# Copy the sdist archive
ADD fantasion-web-*.tgz /var/lib/app

WORKDIR /var/lib/app/package
COPY package-lock.json package-lock.json

RUN \
  apk add nodejs npm && \
  npm ci --production

EXPOSE 3000
CMD npm start
