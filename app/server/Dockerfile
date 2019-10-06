FROM centos:centos7 as builder

MAINTAINER Tatsuki Nakagawa <tatsukinakagawa14@gmail.com>

RUN yum -y install vim gcc-c++ make git which tar lsof wget

# golang install
RUN wget --no-check-certificate -O - http://golang.org/dl/go1.12.linux-amd64.tar.gz | tar xzf - -C /usr/local

# dep
RUN mkdir /home/go
RUN mkdir /home/go/bin
ENV GOPATH=/home/go
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOPATH/bin:$GOROOT/bin
RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

WORKDIR /home/go/src/expenses
COPY . .
RUN go get -v github.com/jessevdk/go-assets-builder
ARG PARAMETER_1
ARG PARAMETER_2
ENV APP_ENV $PARAMETER_1
ENV ALLOW_ORIGIN $PARAMETER_2
RUN CGO_ENABLED=0 GOOS=linux go build -v -o expenses


# Use a Docker multi-stage build to create a lean production image.
# https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds
FROM alpine as prod
RUN apk add --no-cache ca-certificates

# Copy the binary to the production image from the builder stage.
COPY --from=builder /home/go/src/expenses/expenses /expenses
COPY --from=builder /home/go/src/expenses/.env /.env

ARG PARAMETER_1
ARG PARAMETER_2
ENV APP_ENV $PARAMETER_1
ENV ALLOW_ORIGIN $PARAMETER_2


# Run the web service on container startup.
EXPOSE 8080
CMD ["/expenses"]
