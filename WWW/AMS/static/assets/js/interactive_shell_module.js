/**
 * Created by isac322 on 16. 5. 17.
 */

const CMD_INITIALIZE = 0;
const CMD_REQ_OUTPUT = 1;
const CMD_PROCESS_DONE = 2;
const CMD_PROCESS_ERROR = 3;

document.addEventListener("DOMContentLoaded", function () {
	var screen = document.getElementById('screen');
	var request = new XMLHttpRequest();
	var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
	var runBtn = document.getElementById('btn-run');
	var sessionId;
	var socket;

	runBtn.addEventListener('click', function () {
		request.onreadystatechange = function () {
			if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
				sessionId = request.getResponseHeader('X-ShellSession');

				var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
				var ws_path = ws_scheme + '://' + window.location.host + "/ws";
				socket = new ReconnectingWebSocket(ws_path);

				socket.onopen = function () {
					socket.send(JSON.stringify({
						"command": CMD_INITIALIZE,
						"session": sessionId
					}));
				};

				socket.onmessage = socketCallBack;
			}
		};

		request.open("POST", 'shell/begin', true);
		request.setRequestHeader("X-CSRFToken", csrf_token[1]);
		request.send();
	});

	// TODO: add scroll
	var term = new Terminal(
		{
			greeting: '%+r 제출한 소스코드에 입력을 전송합니다. \n 입출력을 확인하고 선택하세요.' +
			' \n 세션은 마지막 입력으로 부터 5분간만 유지됩니다. %-r\n',
			handler: termHandler,
			termDiv: 'screen-wrapper',
			bgColor: '#232e45',
			fontClass: 'Nanum Gothic Coding',
			crsrBlinkMode: true,
			ps: '>>>'
		}
	);

	function termHandler() {
		this.newLine();

		var line = this.lineBuffer;
		socket.send(JSON.stringify({
			'command': CMD_REQ_OUTPUT,
			'session': sessionId,
			'message': line
		}));
	}

	function socketCallBack(message) {
		var response = JSON.parse(message.data);

		switch (response.command) {
			case CMD_INITIALIZE:
				term.open();
				break;

			case CMD_REQ_OUTPUT:
				term.write(response.message);
				term.prompt();
				break;

			// TODO: implement
			case CMD_PROCESS_DONE:
				term.cursorOff();
				term.newLine();
				term.write('%+r 프로그램을 다시 시작합니다. %-r');
				term.prompt();
				break;

			// TODO: implement
			case CMD_PROCESS_ERROR:
				break;

			default:
				term.write(fail);
				term.prompt();
		}
	}
});