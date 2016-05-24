#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

import docker
import io
import os
from judge_server.configuration.config import Config

__author__ = "isac322, nameuk"


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
			for _, v in j.items():
				print(v, end='')

	else:
		print("'{0}' image is already exist".format(docker_tag))


def judge(instance, media_path, inputfiles):
	#: docker daemon address
	docker_daemon = Config["Docker"]["daemon_address"]
	#: python interface of docker's client handler
	cli = docker.Client(base_url=docker_daemon, version="auto")
	image_tag = Config["Docker"]["tag"]

	build_image()

	current = os.path.dirname(__file__)

	# TODO: compress code. and use `Config`

	container = None
	container = cli.create_container(
		image=image_tag,
		command='/compiler_and_judge/lang_option.sh',
		volumes=['/source_code', '/compiler_and_judge', '/inputfiles'],
		host_config=cli.create_host_config(binds={
			media_path: {'bind': '/source_code', 'mode': 'rw'},
			current: {'bind': '/compiler_and_judge', 'mode': 'rw'},
			inputfiles: {'bind': '/inputfiles', 'mode': 'ro'}
		})
	)
	cli.start(container)
	cli.wait(container)
	cli.remove_container(container)


# TODO: when debug is finished, must handle docker container exception at this point


if __name__ == "__main__":
	build_image()
