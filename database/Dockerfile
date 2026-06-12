FROM postgres:16-alpine

ENV POSTGRES_USER=keenkeyin
ENV POSTGRES_PASSWORD=keenkeyin
ENV POSTGRES_DB=keenkeyin

COPY init/ /docker-entrypoint-initdb.d/

EXPOSE 5432
