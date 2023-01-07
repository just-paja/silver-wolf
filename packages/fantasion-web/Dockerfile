FROM alpine:3.17

# Copy the sdist archive
ADD fantasion-web-*.tgz /var/lib/app

WORKDIR /var/lib/app/package
COPY package-lock.json package-lock.json

RUN \
  apk add "nodejs~=18" npm && \
  npm ci --omit=dev --omit=optional

EXPOSE 3000
CMD npm start
