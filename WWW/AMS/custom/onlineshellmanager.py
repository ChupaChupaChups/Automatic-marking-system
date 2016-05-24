# -*- coding: utf-8 -*-

import inspect
import sys
import threading

import docker
import os
import random

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, os.path.dirname(parent_dir))

from judge_server.configuration.config import Config

__author__ = 'isac322'

_CONST_MAX_SESSION = 100000
_sessions = dict()

_client = None


def _get_client():
	"""
	Return global variable ``_client``
	if ``_client`` doesn't exist make it and return

	Rather than make client handle every time needed, using this method are reduce duplicate client object

	:return	docker-py's docker client handle
	"""
	global _client

	if _client is None:
		#: docker daemon address
		docker_daemon = Config["Docker"]["daemon_address"]
		#: python interface of docker's client handler
		_client = docker.Client(base_url=docker_daemon, version="auto")
	return _client


def _generate_session():
	"""
	Make session consist of random integer to distinguish request

	:return	session id
	"""
	return random.randint(0, _CONST_MAX_SESSION)


def build_session():
	session = _generate_session()
	while session in _sessions.keys():
		session = _generate_session()

	client = _get_client()

	_sessions[session] = Session(client, session)

	print('build session {0}'.format(session))

	return session


def get_output(request):
	session = int(request.META['HTTP_X_SHELLSESSION'])
	shell = _sessions[session]

	output_string = shell.get_output(request.POST['input_string'])
	print('printed :' + output_string)

	outputs = {
		'output': output_string
	}
	return outputs


class Session:
	def __init__(self, client, session_id):
		self.container = None
		self.socket = None
		self.thread = None
		self.session = session_id

		self._make_container(client)
		self._make_socket(client)
		self._start_container(client)

	def _make_container(self, client):
		"""
		Make container to test user's input and return container object

		:return	docker-py's container object
		"""
		image_tag = Config["Docker"]["tag"]

		media_path = '/home/isac322/project/Automatic-marking-system/WWW/media/answer/39'
		input_files = '/home/isac322/project/Automatic-marking-system/WWW/media/problem/1111/testcase'
		current = '/home/isac322/project/Automatic-marking-system/judge_server'

		self.container = client.create_container(
				image=image_tag,
				stdin_open=True,
				# command='/bin/bash',
				command='/compiler_and_judge/test4.py',
				volumes=['/source_code', '/compiler_and_judge', '/inputfiles'],
				host_config=client.create_host_config(binds={
					media_path: {'bind': '/source_code', 'mode': 'rw'},
					current: {'bind': '/compiler_and_judge', 'mode': 'rw'},
					input_files: {'bind': '/inputfiles', 'mode': 'ro'}
				})
		)

	def _make_socket(self, client):
		self.socket = client.attach_socket(container=self.container, params={
			'stdin': 1,
			'stdout': 1,
			'stderr': 1,
			'stream': 1
		}, ws=True)

	def _start_container(self, client):
		def _target():
			client.start(self.container)
			client.wait(self.container)
			client.remove_container(self.container)

		thread = threading.Thread(target=_target, daemon=True)
		thread.start()

	def get_output(self, input_str):
		# TODO: check container status and recreate container
		input_str += '\n'
		self.socket.send(input_str.encode())

		output_str = self.socket.recv()
		output_str = output_str[:-1]
		return output_str
