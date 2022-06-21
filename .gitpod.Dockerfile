FROM gitpod/workspace-full-vnc

ENV CYPRESS_CACHE_FOLDER=/workspace/.cypress-cache

# Install Cypress dependencies.
RUN sudo apt-get update \
    && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb \
    && sudo rm -rf /var/lib/apt/lists/*

# Install Firefox

RUN sudo apt-get update -q \
    && sudo apt-get install -yq \
    firefox \
    && sudo rm -rf /var/lib/apt/lists/*

# Install leeway
RUN curl -o /tmp/leeway.tar -fsSL https://github.com/gitpod-io/leeway/releases/download/v0.2.18/leeway_0.2.18_Linux_x86_64.tar.gz \
    && cd /usr/bin \
    && sudo tar -xvf /tmp/leeway.tar leeway \
    && sudo chmod u+x /usr/bin/leeway \
    && rm -f /tmp/leeway.tar
