# syntax=docker/dockerfile:1

FROM node:lts
LABEL org.opencontainers.image.description Moscow Time Twitter Bot

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV=production

WORKDIR /app

# Install Google Chrome Stable and fonts
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production
COPY . .

# Run as non-privileged
USER node
