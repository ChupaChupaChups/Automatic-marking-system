FROM ubuntu:14.04
MAINTAINER ByeongHun, Yoo <isac322@naver.com>

RUN apt update
RUN apt install software-properties-common -y

RUN add-apt-repository ppa:ubuntu-toolchain-r/test -y
RUN add-apt-repository ppa:webupd8team/java -y
RUN apt update
RUN apt install gcc-5 g++-5 python python3 -y

RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections
RUN apt install oracle-java8-installer -y

RUN rm -rf /var/lib/apt/lists/*
RUN rm -rf /var/cache/oracle-jdk8-installer
RUN apt-get clean

RUN mkdir source_code
RUN mkdir compiler_and_judge

ADD ./*.sh /compiler_and_judge/

RUN mkdir inputfiles
