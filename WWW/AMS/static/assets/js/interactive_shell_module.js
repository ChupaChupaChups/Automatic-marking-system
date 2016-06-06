/**
 * Created by isac322 on 16. 5. 17.
 */

const CMD_INITIALIZE = 0;
const CMD_REQ_OUTPUT = 1;
const CMD_PROCESS_DONE = 2;
const CMD_KILL_PROCESS = 3;
const CMD_PROCESS_ERROR = 4;
const CMD_RESET_SESSION = 5;

var term = null;

document.addEventListener("DOMContentLoaded", function () {
	var socket = null;
	var sessionId;
	var screen = document.getElementById('screen-wrapper');
	var request = new XMLHttpRequest();
	var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
	var runBtn = document.getElementById('btn-run');
	var killBtn = document.getElementById('btn-kill');

	killBtn.disabled = true;
	killBtn.addEventListener('click', sessionClose);

	window.addEventListener("beforeunload", sessionClose);


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
				killBtn.disabled = false;
				runBtn.disabled = true;
			}
		};

		request.open("POST", 'shell/begin', true);
		request.setRequestHeader("X-CSRFToken", csrf_token[1]);
		request.send();
	});

	// TODO: changing size feature
	// TODO: add ctrl key handling
	// TODO: support Paste (Ctrl + V)
	// TODO: should handle special ``write`` parameter like ``%+r`` or ``%-r``
	term = new Terminal(
		{
			greeting: '%+r Start program %-r',
			termDiv: 'screen-wrapper',
			bgColor: '#232e45',
			fontClass: 'Nanum Gothic Coding',
			crsrBlinkMode: true,
			ps: '>>>',
			closeOnESC: false,
			catchCtrlH: false,
			handler: termHandler,
			initHandler: termInitHandler,
			exitHandler: termExitHandler,
			ctrlHandler: termCtrlHandler
		}
	);
	term.open();
	term.close();

	function termHandler() {
		this.newLine();

		var line = this.lineBuffer;
		socket.send(JSON.stringify({
			'command': CMD_REQ_OUTPUT,
			'session': sessionId,
			'message': line
		}));
	}

	function termFocus() {
		term.globals.keylock = false;
	}

	function termBlur() {
		term.globals.keylock = true;
	}

	function termPaste(e) {
		var pastedText = null;
		if (window.clipboardData && window.clipboardData.getData) { // IE
			pastedText = window.clipboardData.getData('Text');
		} else if (e.clipboardData && e.clipboardData.getData) {
			pastedText = e.clipboardData.getData('text/plain');
		}

		term.globals.insertText(pastedText);
	}

	/**
	 *  invoked between ``Terminal`` creation and initialization
	 */
	function termInitHandler() {
		screen.focus();

		screen.addEventListener('focus', termFocus);
		screen.addEventListener('blur', termBlur);
		screen.addEventListener("paste", termPaste);

		this.write(this.conf.greeting);
		this.newLine();
		this.prompt();
	}

	function termExitHandler() {
		screen.removeEventListener('focus', termFocus);
		screen.removeEventListener('blur', termBlur);
		screen.removeEventListener("paste", termPaste);
	}

	function socketCallBack(message) {
		var response = JSON.parse(message.data);

		switch (response.command) {
			case CMD_RESET_SESSION:
				sessionId = response.session;

			case CMD_INITIALIZE:
				term.open();
				screen.style.maxHeight = screen.clientHeight + 'px';
				break;

			case CMD_REQ_OUTPUT:
				term.write(response.message);
				term.prompt();
				break;

			// FIXME: add history list's element
			case CMD_PROCESS_DONE:
				term.cursorOff();
				term.cursorSet(term.r, 0);
				term.write('%+r Restart Program %-r');
				term.prompt();
				break;

			// TODO: implement
			case CMD_PROCESS_ERROR:
				break;

			default:
				console.log('unsupported command :' + response.command);
				term.write('fail');
				term.prompt();
		}
	}

	function termCtrlHandler() {
		console.log(this.inputChar);
	}

	function sessionClose() {
		if (socket) {
			socket.send(JSON.stringify({
				'command': CMD_KILL_PROCESS,
				'session': sessionId
			}));

			socket.close();
			term.close();
		}

		killBtn.disabled = true;
		runBtn.disabled = false;
	}
});