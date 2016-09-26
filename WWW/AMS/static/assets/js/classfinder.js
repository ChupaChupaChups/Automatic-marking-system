var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);

/**
 * Java의 경우 사용, 클래스의 이름을 엔트리 포인트 설정을 위해 추출.
 *
 * TODO: main()이 하나인 경우 entry point 리스트를 끄도록 수정
 */
function extractClass(fileList, folderList, entryList) {
	// 이전목록 지움
	while (entryList.options.length) entryList.remove(0);

	// 폴더와 파일 각각 읽기 시작
	var i;
	for (i = 0; i < folderList.length; i++) {
		if (/\.java/i.test(folderList[i].name)) {
			findEntryPoint(folderList[i]);
		}
	}
	for (i = 0; i < fileList.length; i++) {
		if (/\.java/i.test(fileList[i].name)) {
			findEntryPoint(fileList[i]);
		}
	}

	// 실제 entry point 찾는 함수
	function findEntryPoint(file) {
		var reader = new FileReader();
		/**
		 * 파일 읽기가 완료된 경우 호출됨
		 * 정규표현식 객체 `regexp`로 클래스 이름 걸러내고 선택지에 추가
		 *
		 * @param event    이벤트 객체
		 */
		reader.onload = function (event) {
			var contents = event.target.result;
			var matchesPackage = /package\s+(\w+(\s*\.\s*\w+)*)/g.exec(contents);
			var classExtractor = /class\s+(\w+)/g;

			var matchesClass;
			while (matchesClass = classExtractor.exec(contents)) {
				var startPoint = matchesClass.index + matchesClass[0].length;

				while (contents[startPoint] != '{') startPoint++;

				var balance = 1, endPoint;
				for (endPoint = startPoint; endPoint < contents.length; endPoint++) {
					switch (contents[endPoint]) {
						case '{':
							balance++;
							break;
						case '}':
							balance--;
							if (balance == 0) {
								break;
							}
					}
				}

				var mainTester = /public\s+static\s+void\s+main\s*\((final)?\s*String\s*(\[]|\.\.\.)\s*\w+\)/g;

				var classContent = contents.slice(startPoint, endPoint);

				if (mainTester.test(classContent)) {
					var result = null;
					if (matchesPackage) {
						result = matchesPackage[1] + '.' + matchesClass[1];
					} else {
						result = matchesClass[1];
					}

					var option = document.createElement('option');
					option.value = option.text = result;
					entryList.add(option);
				}
			}
		};

		/**
		 * 읽기도중 오류가 날 경우 호출됨
		 * 선택을 초기화하고, 메시지박스 띄움
		 */
		reader.onerror = function () {
			alert('File could not be read!');
		};

		// 비동기로 파일읽기 시작
		reader.readAsText(file);
	}
}

/**
 * Python의 경우 사용, 파일들의 이름을 엔트리 포인트 설정을 위해 추출.
 *
 * FIXME: 폴더를 올린 상태에서 그중에 하나만 삭제하고 다시 같은 폴더를 올리면 추가가 안됨
 * FIXME: 파일을 삭제했을때 entryList 에서는 안지워짐
 * TODO: FormData()는 ie, safari, chrome(<50v)등에서 지원이 안됨. JQuery를 찾아봐야할듯. (http://malsup.com/jquery/form)
 */
var form = document.querySelector('form');

function extractFiles(fileList, folderList, entryList) {
	// 이전 목록 지우기
	while (entryList.options.length) entryList.remove(0);

	var formData = new FormData(form);

	function tester(currentValue) {
		if (/\.py$/i.test(currentValue.name)) {
			formData.append('attachments', currentValue);
		}
	}

	folderList.forEach(tester);
	fileList.forEach(tester);

	switch (formData.getAll('attachments').length) {
		case 1:
			var option = document.createElement('option');
			option.text = option.value = formData.get('attachments').name;
			entryList.add(option);

		case 0:
			return;
	}

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var all_file = JSON.parse(xhr.responseText);
			for (var i = 0; i < all_file.file_name.length; i++) {
				var option = document.createElement('option');
				option.value = option.text = all_file.file_name[i];
				entryList.add(option);
			}
		}
	};

	xhr.open('POST', '/savefiles');
	xhr.setRequestHeader('X-CSRFToken', csrf_token[1]);
	xhr.send(formData);
}