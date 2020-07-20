# parent images (from docker hub)
FROM node:12.14.1

# directory in the container we want to workout
# now "./" is the same as WORDIR
WORKDIR /usr/src/smart-brain-api

# COPY files to container
# COPY <local directory> <dir in the container>
COPY ./ ./

# execute command in the container
# a container can have many RUN
RUN npm install
# RUN npm uninstall bcrypt
# RUN npm install   bcrypt

# provide defaults for an executing container
# a docker file has only one CMD
CMD ["/bin/bash"]