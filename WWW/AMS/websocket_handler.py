import json

from .onlineshellmanager import ProcessError, close_shell, gen_output, check_or_build

CMD_INIT = 0
CMD_REQ_OUTPUT = 1
CMD_PROCESS_DONE = 2
CMD_KILL_PROCESS = 3
CMD_PROCESS_ERROR = 4
CMD_RESET_SESSION = 5


# TODO: handling ``JSONDecodeError``
def req_handler(message):
	payload = json.loads(message['text'])

	def _send_dict(obj):
		message.reply_channel.send({
			'text': json.dumps(obj, ensure_ascii=False)
		})

	command = payload['command']

	session = int(payload['session'])
	print('command \"{}\" on session \"{}\"'.format(command, session))

	if command == CMD_INIT:
		check, session = check_or_build(session)

		if check:
			_send_dict({
				'command': CMD_INIT
			})
		else:
			print('rebuild session {}'.format(session))
			_send_dict({
				'command': CMD_RESET_SESSION,
				'session': str(session)
			})

	elif command == CMD_REQ_OUTPUT:
		try:
			output_string, status = gen_output(session, payload['message'])
			print('printed :' + output_string)

			_send_dict({
				'command': CMD_REQ_OUTPUT,
				'message': output_string
			})

			if status:
				_send_dict({
					'command': CMD_PROCESS_DONE
				})

		# TODO: implement
		except ProcessError:
			pass

	elif command == CMD_KILL_PROCESS:
		close_shell(session)


def open_test(message):
	print('WebSocket open')
