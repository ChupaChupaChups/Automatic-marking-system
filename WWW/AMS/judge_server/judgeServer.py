#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

import docker
import io
import os
from .config import Config

__author__ = "isac322, nameuk"

_docker_client = None


def _get_client():
	"""
	Return global variable ``_docker_client``
	if ``_docker_client`` doesn't exist make it and return

	Rather than make client handle every time needed, using this method are reduce duplicate client object

	:return	docker-py's docker client handle
	"""
	global _docker_client

	if _docker_client is None:
		#: docker daemon address
		docker_daemon = Config["Docker"]["daemon_address"]
		#: python interface of docker's client handler
		_docker_client = docker.Client(base_url=docker_daemon, version="auto")
	return _docker_client


def build_image():
	docker_client = _get_client()

	docker_tag = Config["Docker"]["tag"]

	# if docker image that named `docker_tag` is not exist than, generate it
	#	for DEBUG
	#	if len(docker_client.images(name=docker_tag)) is 0:
	current_path = os.path.dirname(__file__)
	with open(os.path.join(current_path, Config["Docker"]["Dockerfile"])) as dockerfile_fp:
		dockerfile_text = io.BytesIO(dockerfile_fp.read().encode("UTF-8"))

		for line in docker_client.build(fileobj=dockerfile_text, tag=docker_tag, rm=True):
			j = json.loads(line.decode())
			for _, v in j.items():
				print(v, end='')


# else:
#		print("'{0}' image is already exist".format(docker_tag))


def judge(media_path, inputfiles):
	cli = _get_client()
	image_tag = Config["Docker"]["tag"]

	build_image()

	current = os.path.dirname(__file__)

	# TODO: dynamic inputfiles

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

def make_container(image_tag, command=None, volume_bind=None, **kwargs):
	client = _get_client()

	if volume_bind is not None:
		config = client.create_host_config(binds=volume_bind)

		container = client.create_container(
				image=image_tag,
				command=command,
				volumes=list(volume_bind.keys()),
				host_config=config,
				**kwargs
		)

		return container, config

	else:
		container = client.create_container(
				image=image_tag,
				command=command,
				**kwargs
		)
		return container


if __name__ == "__main__":
	build_image()
