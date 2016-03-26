#!/usr/bin/python3
# -*- coding: utf-8 -*-

import io
import json
import os

from configuration.config import Config

import docker

__author__ = "isac322"

#: docker daemon address
dockerDaemon = Config["Docker"]["daemon_address"]
dockerClient = docker.Client(base_url=dockerDaemon, version="auto")

dockerTag = Config["Docker"]["tag"]

# if docker image that named dockerTag is not exist than, generate it
if len(dockerClient.images(name=dockerTag)) is 0:
	DockerfileFP = open(os.path.join(os.path.dirname(__file__), Config["Docker"]["Dockerfile"]))
	DockerfileText = io.BytesIO(DockerfileFP.read().encode("UTF-8"))
	DockerfileFP.close()

	for line in dockerClient.build(fileobj=DockerfileText, tag=dockerTag, rm=True):
		j = json.loads(line.decode())
		print(j["stream"], end='')
