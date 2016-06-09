// TODO: Convert Jquery to pure JavaScript
// FIXME: 언어 선택을 여러번 바꿀 경우 서버에 DDOS급 테러가 이뤄집!!!
// FIXME: 폴더 Drag & Drop는 잘 되지만 클릭으로 올리면 저장에 에러

/**
 * Java의 경우 사용, 클래스의 이름을 엔트리 포인트 설정을 위해 추출.
 *
 * TODO: main()이 있는 클래스만 엔트리 포인트 목록에 추가하도록 수정
 * TODO: main()이 하나인 경우 자동으로 그 클래스를 엔트리 포인트로 사용하는 기능 추가
 * TODO: main()이 하나인 경우 entry point 리스트를 끄도록 수정
 */
var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);

function extractClass(fileList, folderList, entryList) {
	// 이전목록 지움
	while (entryList.options.length) entryList.remove(0);

	// 추가된 개별 파일과 폴더 하나로 합침
	var printFileList = [], i;
	for (i = 0; i < folderList.length; i++) {
		if (/\.java/.test(folderList[i])) {
			printFileList.push(folderList[i]);
		}
	}
	for (i = 0; i < fileList.length; i++) {
		if (/\.java/.test(folderList[i])) {
			printFileList.push(fileList[i]);
		}
	}

	// 파일 읽기 시작
	var entries = [];
	for (i = 0; i < printFileList.length; i++) {
		console.log('start\t' + printFileList[i].name);
		var reader = new FileReader();
		/**
		 * 파일 읽기가 완료된 경우 호출됨
		 * 정규표현식 객체 `regex`로 클래스 이름 걸러내고 선택지에 추가
		 * @param event    이벤트 객체
		 */
		reader.onload = function (event) {
			console.log(event.target.result + '\tread');

			var contents = event.target.result;
			var matches_class;
			var matches_package = /package\s+(\w+(\.\w+)*)/g.exec(contents);
			var regex_class = /class\s+(\w+)\s*\{(\s|.)*public\s+static\s+void\s+main\s*\(String(\s+)?(\[]|\.\.\.)\s*\w+\)/g;

			while (matches_class = regex_class.exec(contents)) {
				console.log(matches_class);
				var result = null;
				if (matches_package) {
					result = matches_package[1] + "." + matches_class[1];
				} else {
					result = matches_class[1];
				}

				entries.push(result);
			}

			console.log('done');
			checkAllRead();
		};

		/**
		 * 읽기도중 오류가 날 경우 호출됨
		 * 선택을 초기화하고, 메시지박스 띄움
		 */
		reader.onerror = function () {
			fileUploadBtn.value = '';
			alert("File could not be read!");
			checkAllRead();
		};

		// 비동기로 파일읽기 시작
		reader.readAsText(printFileList[i]);
	}

	// 파일 읽기 완료 확인할 변수
	var checkCount = 0;

	// 파일 읽기 
	function checkAllRead() {
		checkCount++;
		console.log(checkCount);
		if (checkCount == printFileList.length) {
			for (var i in entries) {
				var option = document.createElement("option");
				option.value = option.text = entries[i];
				entryList.add(option);
			}
		}
	}
}

/**
 * Python의 경우 사용, 파일들의 이름을 엔트리 포인트 설정을 위해 추출.
 */
var form = document.querySelector("form");

function extractFiles(fileList, folderList, entryList) {
	// 이전 목록 지우기
	while (entryList.options.length) entryList.remove(0);

	var formdata = new FormData(form);
	var i;
	for (i = 0; i < folderList.length; i++) {
		if (/\.py/.test(folderList[i].name)) {
			formdata.append("attachments", folderList[i]);
		}
	}
	for (i = 0; i < fileList.length; i++) {
		if (/\.py/.test(fileList[i].name)) {
			formdata.append("attachments", fileList[i]);
		}
	}

	var xhr = makeHttpObject();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var all_file = JSON.parse(xhr.responseText);

			all_file.file_name.forEach(function (currentValue) {
				var option = document.createElement("option");
				option.text = option.value = currentValue;
				entryList.add(option);
			});
		}
	};

	xhr.open("POST", "/savefiles");
	xhr.setRequestHeader("X-CSRFToken", csrf_token[1]);
	xhr.send(formdata);
}

function makeHttpObject() {
	try {
		return new XMLHttpRequest();
	}
	catch (error) {
	}
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch (error) {
	}
	try {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	catch (error) {
	}
	throw new Error("Could not create HTTP request object.");
}
