# -*- coding: utf-8 -*-

import selectors

import os
import random
from .judge_server import judgeServer
from .judge_server.config import Config

__author__ = 'isac322'

_sessions = dict()


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

	_sessions[session] = ShellSession(session)

	print('build session {0}'.format(session))

	return session


# TODO: add error handling
def get_shell(session):
	return _sessions[session]


class ShellSession:
	def __init__(self, session_id):
		self._session = session_id
		self._selector = selectors.DefaultSelector()

		self._container, self._config = ShellSession._make_container()
		judgeServer.async_start_container(self._container)
		self._socket = judgeServer.get_websocket(self._container)
		self._selector.register(self._socket, selectors.EVENT_READ)

	@staticmethod
	def _make_container():
		"""
		Make container to test user's input and return container object

		:return	docker-py's container object
		:return docker-py's host config
		"""
		image_tag = Config["Docker"]["tag"]

		# TODO: dynamic file select
		current = os.path.dirname(__file__)
		current = os.path.join(current, 'judge_server')

		return judgeServer.make_container(
				image_tag=image_tag,
				stdin_open=True,
				command='/compiler_and_judge/shell_executor.py',
				volume_bind={
					current: {'bind': '/compiler_and_judge', 'mode': 'rw'}
				}
		)

	def get_output(self, input_str):
		"""
		Generate output string from docker container by given input string

		:param	{str}	input string
		:return	{str}	docker container's output from given input string ``input_str``
		:return	{bool}	container's status. if ``True`` container exits with exit code 0. if ``False`` running status.
		"""
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

		elif control_char == '\u0004':
			output_str = output_str[:-2]
			self._selector.unregister(self._socket)
			self._container, self._config = ShellSession._make_container()
			self._socket = judgeServer.get_websocket(self._container)
			judgeServer.async_start_container(self._container)
			self._selector.register(self._socket, selectors.EVENT_READ)
			return output_str, True

		raise NotImplementedError


class ProcessError(Exception):
	pass
