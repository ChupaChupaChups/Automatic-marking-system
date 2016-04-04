FROM ubuntu:14.04
MAINTAINER ByeongHun, Yoo <isac322@naver.com>

RUN /bin/bash -c "\
apt update; \
apt install software-properties-common -y; \

add-apt-repository ppa:ubuntu-toolchain-r/test -y; \
add-apt-repository ppa:webupd8team/java -y; \
apt update; \
apt install gcc-5 g++-5 python python3 -y; \

echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections; \
apt install oracle-java8-installer -y; \

rm -rf /var/lib/apt/lists/*; \
rm -rf /var/cache/oracle-jdk8-installer; \
apt-get clean; \

mkdir source_code"
