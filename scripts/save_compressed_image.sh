#!/bin/bash

# Define variables
IMAGE_NAME="aafiat-backend"
IMAGE_TAG="latest"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TAR_FILE="${SCRIPT_DIR}/${IMAGE_NAME}-${IMAGE_TAG}.tar.gz"

# Build the Docker image
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

# Save the Docker image to a tar file and compress it
docker save ${IMAGE_NAME}:${IMAGE_TAG} | gzip > ${TAR_FILE}

echo "Docker image saved and compressed as ${TAR_FILE}"
