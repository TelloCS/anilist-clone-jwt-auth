# AniList Clone
Django and React based project that integrates the AniList GraphQL API to demonstrate user watchlists and JWT HttpOnly cookie authentication with secure token blacklisting.

## Local Development
To spin up the development environment with hot-reloading:
```shell
docker compose -f docker-compose.yml up --build
```
## Production Deployment
To run the project in a hardened production state (detached mode):
```shell
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```
