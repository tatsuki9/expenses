FROM centos:centos7 as builder

MAINTAINER Tatsuki Nakagawa <tatsukinakagawa14@gmail.com>

RUN yum -y install vim gcc-c++ make git which tar lsof wget

# nvm, node+npm install
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 10.16.3

RUN git clone git://github.com/creationix/nvm.git $NVM_DIR && \
    source $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Angular install
RUN npm install -g typescript && \
    npm install -g typings && \
    npm install -g @angular/cli

WORKDIR /home/frontend
COPY package*.json /home/frontend/
RUN npm install
COPY ./ /home/frontend/
ARG PARAMETER_1
RUN npm run build -- --output-path=./dist/out --configuration ${PARAMETER_1}

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15 as prod
#Copy ci-dashboard-dist
COPY --from=builder /home/frontend/dist/out/ /usr/share/nginx/html
#Copy default nginx configuration
COPY ./nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf
