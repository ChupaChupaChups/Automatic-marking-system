/**
 * Created by isac322 on 16. 5. 17.
 */

const CMD_INITIALIZE = 0;
const CMD_REQ_OUTPUT = 1;
const CMD_PROCESS_DONE = 2;
const CMD_KILL_PROCESS = 3;
const CMD_PROCESS_ERROR = 4;
const CMD_RESET_SESSION = 5;

var socket = null;
var screen = document.getElementById('screen-wrapper');
var shell_content = document.getElementById('shell-content');
var shell_result = document.getElementById('shell-result');

window.addEventListener("beforeunload", sessionClose);


// TODO: changing size feature
// TODO: should handle special ``write`` parameter like ``%+r`` or ``%-r``
var term = new Terminal(
	{
		greeting: '%+r Start program %-r',
		termDiv: 'screen-wrapper',
		bgColor: '#232e45',
		cols: 65,
		fontClass: 'Nanum Gothic Coding',
		crsrBlinkMode: true,
		ps: '>>>',
		closeOnESC: false,
		catchCtrlH: false,
		handler: termHandler,
		initHandler: termInitHandler,
		exitHandler: termExitHandler
	}
);
term.open();
term.close();

function termFocus() {
	term.cursorOn();
	term.globals.keylock = false;
}

function termBlur() {
	term.cursorOff();
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

	this.globals.keylock = false;
	screen.addEventListener('focus', termFocus);
	screen.addEventListener('blur', termBlur);
	screen.addEventListener("paste", termPaste);

	shell_content.style.display = 'block';
	shell_result.style.display = 'block';

	this.write(this.conf.greeting);
	this.newLine();
	this.prompt();
}

function termExitHandler() {
	screen.removeEventListener('focus', termFocus);
	screen.removeEventListener('blur', termBlur);
	screen.removeEventListener("paste", termPaste);

	shellResults = [];
	tempResult = {input: '', output: ''};

	shell_content.style.display = 'none';
	shell_result.style.display = 'none';
}

var shellResults = [];
var tempResult = {input: '', output: ''};

function termHandler() {
	term.lock = true;
	this.newLine();

	var line = this.lineBuffer;
	socket.send(JSON.stringify({
		'command': CMD_REQ_OUTPUT,
		'session': this.id,
		'message': line
	}));

	tempResult.input += line + '\n';
}

function socketCallBack(message) {
	var response = JSON.parse(message.data);

	switch (response.command) {
		case CMD_RESET_SESSION:
			term.conf.id = term.id = response.session;

		case CMD_INITIALIZE:
			var sourceUploadPanel = document.getElementById('source-code-panel');
			sourceUploadPanel.className = sourceUploadPanel.className.replace('col-md-12', 'col-md-6');
			term.open();
			screen.style.maxHeight = screen.clientHeight + 'px';
			break;

		case CMD_REQ_OUTPUT:
			tempResult.output += response.message;
			term.write(response.message);
			term.prompt();
			term.lock = false;
			break;

		// FIXME: add history list's element
		case CMD_PROCESS_DONE:
			shellResults.push(tempResult);
			tempResult = {input: '', output: ''};
			makeResult();

			term.cursorSet(term.r, 0);
			term.write('%+r Restart Program %-r');
			term.prompt();
			term.lock = false;
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

function sessionClose() {
	if (socket) {
		socket.send(JSON.stringify({
			'command': CMD_KILL_PROCESS,
			'session': term.id
		}));

		socket.close();
		term.close();
	}
}