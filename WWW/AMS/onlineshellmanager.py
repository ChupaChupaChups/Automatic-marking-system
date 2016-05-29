# -*- coding: utf-8 -*-

import selectors
import threading

import docker
import os
import random
from .judge_server import judgeServer
from .judge_server.config import Config

__author__ = 'isac322'

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

	:return	session id (64bit number)
	"""
	return random.getrandbits(64)


def build_session():
	"""
	When shell request received build unique session to classify shells

	:return session id (see ``_generate_session``)
	"""
	session = _generate_session()
	while session in _sessions.keys():
		session = _generate_session()

	client = _get_client()

	_sessions[session] = ShellSession(client, session)

	print('build session {0}'.format(session))

	return session


# TODO: add error handling
def get_shell(session):
	return _sessions[session]


class ShellSession:
	def __init__(self, client, session_id):
		self._client = client
		self._container = None
		self._config = None
		self._socket = None
		self._thread = None
		self._session = session_id
		self._reply_channel = None
		self._selector = selectors.DefaultSelector()

		self._make_container()
		self._make_socket(client)
		self._start_container(client)
		self._selector.register(self._socket, selectors.EVENT_READ)

	def _make_container(self):
		"""
		Make container to test user's input and return container object

		:return	docker-py's container object
		"""
		image_tag = Config["Docker"]["tag"]

		# TODO: dynamic file select
		current = os.path.dirname(__file__)
		current = os.path.join(current, 'judge_server')

		self._container, self._config = judgeServer.make_container(
				image_tag=image_tag,
				stdin_open=True,
				command='/compiler_and_judge/shell_executor.py',
				volume_bind={
					current: {'bind': '/compiler_and_judge', 'mode': 'rw'}
				}
		)

	def _make_socket(self, client):
		self._socket = client.attach_socket(container=self._container, params={
			'stdin': 1,
			'stdout': 1,
			'stderr': 1,
			'stream': 1
		}, ws=True)

	def _start_container(self, client):
		def _target(container):
			client.start(container)
			client.wait(container)
			client.remove_container(container)

		thread = threading.Thread(target=_target, daemon=True, args=(self._container,))
		thread.start()

	def get_output(self, input_str):
		"""
		Generate output string from docker container by given input string

		:param	{str}	input string
		:return	{str}	docker container's output from given input string ``input_str``
		:return	{bool}	container's status. if ``True`` container exits with exit code 0. if ``False`` running status.
		"""
		# TODO: check container status and recreate container
		# TODO: error handling
		input_str += '\n'
		self._socket.send(input_str.encode())

		"""
		``output_str``is <output result> + [control chars]

		Possible Control Char:
		\u0003 : END_OF_TEXT
		\u0004 : END_OF_TRANSMISSION
		"""
		output_str = self._socket.recv()

		# TODO: get status from docker container's status
		for event, mask in self._selector.select(0.05):
			output = event.fileobj.recv()
			if output != '\u0004':
				raise NotImplementedError

			output_str += output

		# extract control character
		control_char = output_str[-1]

		if control_char == '\u0003':
			# remove only one character
			output_str = output_str[:-1]

			return output_str, False

		# TODO: remove ``client`` dependency
		elif control_char == '\u0004':
			output_str = output_str[:-2]
			self._selector.unregister(self._socket)
			self._make_container()
			self._make_socket(_get_client())
			self._selector.register(self._socket, selectors.EVENT_READ)
			self._start_container(_get_client())
			return output_str, True

		raise NotImplementedError

	def set_channel(self, channel):
		self._reply_channel = channel

	def get_channel(self):
		return self._reply_channel

	channel = property(get_channel, set_channel)

	def send2channel(self, obj):
		self._reply_channel.send(obj)


class ProcessError(Exception):
	pass
