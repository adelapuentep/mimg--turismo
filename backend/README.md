# Backend (Directus CMS)

This directory contains scripts and configurations related to the Directus headless CMS.

## Docker Setup
The CMS is managed via the `docker-compose.yml` located in the root directory.
It exposes Directus on port `8505`.

Credentials for local development:
- **Email:** admin@turismo.gov.ec
- **Password:** admin

## Schema Initialization
To bootstrap the collections, fields, and translations automatically, run the setup script (ensure Node.js is installed and the Docker container is running):

```bash
cd backend
npm init -y
npm install @directus/sdk
node setup-schema.js
```
