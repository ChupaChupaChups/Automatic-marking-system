#!/usr/bin/python3
# -*- coding: utf-8 -*-

import io
import json
import os

from configuration.config import Config

import docker

__author__ = "isac322"


def build_image():
	#: docker daemon address
	docker_daemon = Config["Docker"]["daemon_address"]
	#: python interface of docker's client handler
	docker_client = docker.Client(base_url=docker_daemon, version="auto")

	docker_tag = Config["Docker"]["tag"]

	# if docker image that named `docker_tag` is not exist than, generate it
	if len(docker_client.images(name=docker_tag)) is 0:
		dockerfile_fp = open(os.path.join(os.path.dirname(__file__), Config["Docker"]["Dockerfile"]))
		dockerfile_text = io.BytesIO(dockerfile_fp.read().encode("UTF-8"))
		dockerfile_fp.close()

		for line in docker_client.build(fileobj=dockerfile_text, tag=docker_tag, rm=True):
			j = json.loads(line.decode())
			print(j["stream"], end='')
	else:
		print("'{0}' image is already exist".format(docker_tag))

if __name__ == "__main__":
	build_image()
