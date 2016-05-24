/**
 * Created by isac322 on 16. 5. 17.
 */

document.addEventListener("DOMContentLoaded", function () {
	var screen = document.getElementById('screen');
	var request = new XMLHttpRequest();
	var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
	var runBtn = document.getElementById('btn-run');
	var sessionId;

	runBtn.addEventListener('click', function () {
		request.onreadystatechange = function () {
			if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
				sessionId = request.getResponseHeader('X-ShellSession');
				term.open();
			}
		};

		request.open("POST", 'image/create', true);
		request.setRequestHeader("X-CSRFToken", csrf_token[1]);
		request.send();
	});

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
		if (line != "") {
			this.send({
				url: '/output/gen',
				method: 'post',
				headers: {
					"X-CSRFToken": csrf_token[1],
					"X-ShellSession": sessionId
				},
				callback: sendCallback,
				data: {
					input_string: line
				}
			});
			return;
		}

		this.prompt();
	}

	function sendCallback() {
		var response = this.socket;

		if (response.success) {
			var jsonData = JSON.parse(response.responseText);

			if (jsonData.output != undefined) {
				this.write(jsonData.output);
			}
		} else if (response.errno) {
			this.write('fail');
		} else {
			this.write('fail1');
		}

		this.prompt();
	}
});