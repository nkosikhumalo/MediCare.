#!/bin/bash
# Loads .env into the shell then starts Spring Boot.
# Run this instead of ./mvnw spring-boot:run directly.

set -a
source "$(dirname "$0")/.env"
set +a

cd "$(dirname "$0")"
./mvnw spring-boot:run
