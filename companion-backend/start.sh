#!/bin/bash
# Loads .env into the shell then starts Spring Boot.
# Run this instead of ./mvnw spring-boot:run directly.

set -a
source "$(dirname "$0")/.env"
set +a

./mvnw spring-boot:run
