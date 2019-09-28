# centos
FROM centos:centos7

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

# golang install
RUN wget --no-check-certificate -O - http://golang.org/dl/go1.12.linux-amd64.tar.gz | tar xzf - -C /usr/local

# dep
RUN mkdir /home/go
RUN mkdir /home/go/bin
ENV GOPATH=/home/go
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOPATH/bin:$GOROOT/bin
RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh
