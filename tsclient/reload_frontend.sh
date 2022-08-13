#!/bin/bash
set -e
docker-compose build with_ai_frontend
docker-compose stop with_ai_frontend
docker-compose up -d with_ai_frontend
