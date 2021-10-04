FROM 971383676178.dkr.ecr.us-west-2.amazonaws.com/node:14.16.1-slim
LABEL maintainer="data-reliability"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY dist              ./dist
COPY generated         ./generated
COPY node_modules_prod ./node_modules
COPY package*.json     ./

EXPOSE 3000

ENTRYPOINT ["node", "./dist/server.js"]
