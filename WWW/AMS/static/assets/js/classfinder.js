var regex = /class\s+([^\W]+)/g;
var x = document.getElementById("id_entry_point");
var fileUploadBtn = document.getElementById("id_attachments");

function readText() {
	// 이전목록 지움
	while (x.options.length) x.remove(0);
	while (fileUploadBtn.hasChildNodes()) fileUploadBtn.remoeChild(fileUploadBtn.lastChild);
//	console.log(fileUploadBtn.files);
	var isJava = document.getElementById("id_p_java_ok").checked;
	if (isJava) {
		for (var i = 0; i < fileUploadBtn.files.length; i++) {
			var reader = new FileReader();

			/**
			 * 파일 읽기가 완료된 경우 호출됨
			 * 정규표현식 객체 `regex`로 클래스 이름 걸러내고 선택지에 추가
			 * @param event    이벤트 객체
			 */
			reader.onload = function (event) {
				var contents = event.target.result;
				var matches;

				while (matches = regex.exec(contents)) {
					//console.log(matches);
					var option = document.createElement("option");
					option.text = matches[1];
					option.value = matches[1];
					x.add(option);
				}

			};

			/**
			 * 읽기도중 오류가 날 경우 호출됨
			 * 선택을 초기화하고, 메시지박스 띄움
			 */
			reader.onerror = function () {
				fileUploadBtn.value = '';
				alert("File could not be read!");
			};

			//console.log(fileUploadBtn.files[i]);
			// 비동기로 파일읽기 시작
			reader.readAsText(fileUploadBtn.files[i]);
		}
	}
	else {
		for (var i = 0; i < fileUploadBtn.files.length; i++) {
			var option = document.createElement("option");
			var input = document.createElement("input");
			input.setAttribute("type", "hidden");
			input.name = fileUploadBtn.files.item(i).name;
			input.value = fileUploadBtn.files.item(i).webkitRelativePath;
			option.text = fileUploadBtn.files.item(i).name;
			option.value = fileUploadBtn.files.item(i).name;
			x.add(option);
			fileUploadBtn.appendChild(input);
		}
	}
}

fileUploadBtn.addEventListener('change', readText, false);
