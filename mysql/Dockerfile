FROM mysql:5.6

RUN apt-get update
RUN apt-get -y install vim locales locales-all

# 日本語入力できるように対応
ENV TZ Asia/Tokyo
RUN echo "${TZ}" > /etc/timezone \
   && dpkg-reconfigure -f noninteractive tzdata \
   && echo "ja_JP.UTF-8 UTF-8" > /etc/locale.gen \
   && locale-gen ja_JP.UTF-8 \
   && dpkg-reconfigure locales \
   && /usr/sbin/update-locale LANG=ja_JP.UTF-8

ENV LANG ja_JP.UTF-8
