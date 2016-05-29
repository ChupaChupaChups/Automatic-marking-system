import json

from .onlineshellmanager import ProcessError, get_shell

CONST_CMD_INIT = 0
CONST_CMD_REQ_OUTPUT = 1
CONST_CMD_PROCESS_DONE = 2
CONST_CMD_PROCESS_ERROR = 3


# TODO: extract from this file. make own file for readability
def req_handler(message):
	payload = json.loads(message['text'])

	def _send_dict(obj):
		message.reply_channel.send({
			'text': json.dumps(obj, ensure_ascii=False)
		})

	command = payload['command']
	session = int(payload['session'])
	print('command \"{}\" on session \"{}\""'.format(command, session))

	if command == CONST_CMD_INIT:
		shell = get_shell(session)
		shell.channel = message.reply_channel

		_send_dict({
			'command': CONST_CMD_INIT
		})

	elif command == CONST_CMD_REQ_OUTPUT:
		shell = get_shell(session)

		try:
			output_string, status = shell.get_output(payload['message'])
			print('printed :' + output_string)

			_send_dict({
				'command': CONST_CMD_REQ_OUTPUT,
				'message': output_string
			})

			if status:
				_send_dict({
					'command': CONST_CMD_PROCESS_DONE
				})

		# TODO: implement
		except ProcessError:
			pass


def open_test(message):
	print('WebSocket open')
	print(message)
