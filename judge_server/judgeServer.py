#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

import docker
import io
import os

import dockerpty

from judge_server.configuration.config import Config

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
			for _, v in j.items():
				print(v, end='')

	else:
		print("'{0}' image is already exist".format(docker_tag))


def judge(instance, media_path, inputfiles):
	cli = docker.Client(base_url='tcp://0.0.0.0:2375')
	image_tag = Config["Docker"]["tag"]

	current = os.path.dirname(__file__)

	container = None
	if instance.language == 1:
		container = cli.create_container(image=image_tag, command='sh /compiler_and_judge/c_compile.sh', name='judge',
										 tty=True,
										 volumes=['/source_code', '/compiler_and_judge', '/inputfiles'],
										 host_config=cli.create_host_config(binds={
											 media_path: {
												 'bind': '/source_code',
												 'mode': 'rw'
											 },
											 current: {
												 'bind': '/compiler_and_judge',
												 'mode': 'rw'
											 },
											 inputfiles: {
												 'bind': '/inputfiles',
												 'mode': 'rw'
											 }
										 }))
	elif instance.language == 2:
		container = cli.create_container(image=image_tag, command='sh /compiler_and_judge/cpp_compile.sh', name='judge',
										 tty=True,
										 volumes=['/source_code', '/compiler_and_judge', '/inputfiles'],
										 host_config=cli.create_host_config(binds={
											 media_path: {
												 'bind': '/source_code',
												 'mode': 'rw'
											 },
											 current: {
												 'bind': '/compiler_and_judge',
												 'mode': 'rw'
											 },
											 inputfiles: {
												 'bind': '/inputfiles',
												 'mode': 'rw'
											 }
										 }))
	elif instance.language == 3:
		container = cli.create_container(image=image_tag, command='sh /compiler_and_judge/java_compile.sh', name='judge',
										  tty=True,
										  volumes=['/source_code', '/compiler_and_judge', '/inputfiles'],
										  host_config=cli.create_host_config(binds={
											  media_path: {
												  'bind': '/source_code',
												  'mode': 'rw'
											  },
											  current: {
												  'bind': '/compiler_and_judge',
												  'mode': 'rw'
											  },
											  inputfiles: {
												  'bind': '/inputfiles',
												  'mode': 'rw'
											  }
										  }))
	elif instance.language == 4:
		container = cli.create_container(image=image_tag, command='sh /compiler_and_judge/run_python.sh', name='judge',
										 tty=True,
										 volumes=['/source_code', '/compiler_and_judge', '/inputfiles'],
										 host_config=cli.create_host_config(binds={
											 media_path: {
												 'bind': '/source_code',
												 'mode': 'rw'
											 },
											 current: {
												 'bind': '/compiler_and_judge',
												 'mode': 'rw'
											 },
											 inputfiles: {
												 'bind': '/inputfiles',
												 'mode': 'rw'
											 }
										 }))

	dockerpty.start(cli, container)
	try:
		cli.remove_container(container='judge')
	except:
		pass


if __name__ == "__main__":
	build_image()
