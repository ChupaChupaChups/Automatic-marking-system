document.addEventListener("DOMContentLoaded", function () {
	var regex = /class\s+([^\W]+)/g;
	var entryList = document.getElementById("id_entry_point");
	var fileUploadBtn = document.getElementById("id_attachments");
	var javaCheckbox = document.getElementById("id_p_java_ok");
	var pythonCheckbox = document.getElementById("id_p_py_ok");

	/**
	 * Java의 경우 사용, 클래스의 이름을 엔트리 포인트 설정을 위해 추출.
	 */
	function extractClass() {
		// 이전목록 지움
		while (entryList.options.length) entryList.remove(0);
//	console.log(fileUploadBtn.files);

		if (javaCheckbox.checked) {
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
						entryList.add(option);
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
				reader.readAsText(fileUploadBtn.files.item(i));
			}
		}
	}

	/**
	 * Python의 경우 사용, 파일들의 이름을 엔트리 포인트 설정을 위해 추출.
	 */
	function extractFiles() {
		while (entryList.options.length) entryList.remove(0);

		for (var i = 0; i < fileUploadBtn.files.length; i++) {
			var option = document.createElement("option");
			option.text = fileUploadBtn.files.item(i).name;
			option.value = fileUploadBtn.files.item(i).name;
			entryList.add(option);
		}
	}

	/**
	 * Django가 디렉토리 구조를 읽을 수 있도록 <input type="hidden"/> 태그를 임의로 생성
	 */
	function hiddenPathGenerator() {
//		console.log("hiddenPathGenerator in");
		while (fileUploadBtn.hasChildNodes()) fileUploadBtn.removeChild(fileUploadBtn.lastChild);

		for (var i = 0; i < fileUploadBtn.files.length; i++) {
//			console.log(fileUploadBtn.files.item(i));
			var input = document.createElement("input");
			input.setAttribute("type", "hidden");
			input.name = fileUploadBtn.files.item(i).name;
			input.value = fileUploadBtn.files.item(i).webkitRelativePath;
			fileUploadBtn.appendChild(input);
		}
	}

	fileUploadBtn.addEventListener('change', hiddenPathGenerator);
	
	if (javaCheckbox.checked) fileUploadBtn.addEventListener('change', extractClass);
	else if (pythonCheckbox.checked) fileUploadBtn.addEventListener('change', extractFiles);


	// 디버딩을 위해 잠시 설정
	// TODO: 디버깅 끝나면 반드시 django에서 처리하도록 설정
	fileUploadBtn.setAttribute("multiple", "");
	fileUploadBtn.setAttribute("webkitdirectory", "");
	fileUploadBtn.setAttribute("directory", "");

	/*
	초기값을 위해 설정
	TODO: 언어별로 다른 함수 호출 하도록 변경
	 */
	if (fileUploadBtn.value != "") extractClass();
});