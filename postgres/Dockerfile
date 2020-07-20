# parent image from docker hub
# FROM postgres:10.3
FROM postgres:12.3

# /docker-entrypoint-initdb.d/ is the root of the i,age
ADD /tables/            /docker-entrypoint-initdb.d/tables/
ADD /seed/              /docker-entrypoint-initdb.d/seed/
ADD /deploy_schemas.sql /docker-entrypoint-initdb.d/ 