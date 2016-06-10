// TODO: Convert Jquery to pure JavaScript

var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);

/**
 * Java의 경우 사용, 클래스의 이름을 엔트리 포인트 설정을 위해 추출.
 *
 * TODO: main()이 있는 클래스만 엔트리 포인트 목록에 추가하도록 수정
 * TODO: main()이 하나인 경우 자동으로 그 클래스를 엔트리 포인트로 사용하는 기능 추가
 * TODO: main()이 하나인 경우 entry point 리스트를 끄도록 수정
 */
function extractClass(fileList, folderList, entryList) {
	// 이전목록 지움
	while (entryList.options.length) entryList.remove(0);

	// 추가된 개별 파일과 폴더 하나로 합침
	var printFileList = [], i;
	for (i = 0; i < folderList.length; i++) {
		if (/\.java$/i.test(folderList[i])) {
			printFileList.push(folderList[i]);
		}
	}
	for (i = 0; i < fileList.length; i++) {
		if (/\.java$/i.test(folderList[i])) {
			printFileList.push(fileList[i]);
		}
	}

	console.log(printFileList);
	// 파일 읽기 시작
	for (i = 0; i < printFileList.length; i++) {
		console.log('start\t' + printFileList[i].name);
		var reader = new FileReader();
		/**
		 * 파일 읽기가 완료된 경우 호출됨
		 * 정규표현식 객체 `regex`로 클래스 이름 걸러내고 선택지에 추가
		 *
		 * FIXME: 클래스와 main()가져오는 부분 수정 필요
		 * @param event    이벤트 객체
		 */
		reader.onload = function (event) {
			var contents = event.target.result;
			var matches_package = /package\s+(\w+(\.\w+)*)/g.exec(contents);
			var class_extractor = /class\s+(\w+)\s*\{((\s|.)*)}/g;

			var matches_class;
			while (matches_class = class_extractor.exec(contents)) {
				var main_tester = /public\s+static\s+void\s+main\s*\(\s*String(\s+)?(\[]|\.\.\.)\s*\w+\)/g;
				if (main_tester.test(matches_class[2])) {
					var result = null;
					if (matches_package) {
						result = matches_package[1] + '.' + matches_class[1];
					} else {
						result = matches_class[1];
					}

					addOption(result);
				}
			}
		};

		/**
		 * 읽기도중 오류가 날 경우 호출됨
		 * 선택을 초기화하고, 메시지박스 띄움
		 */
		reader.onerror = function () {
			fileUploadBtn.value = '';
			alert('File could not be read!');
		};

		// 비동기로 파일읽기 시작
		reader.readAsText(printFileList[i]);
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
var formData = new FormData(form);

function extractFiles(fileList, folderList, entryList) {
	// 이전 목록 지우기
	while (entryList.options.length) entryList.remove(0);

	folderList.forEach(tester);
	fileList.forEach(tester);

	console.log(formData.getAll('attachments'));

	switch (formData.getAll('attachments').length) {
		case 1:
			var option = document.createElement('option');
			option.text = option.value = formData.get('attachments').name;
			entryList.add(option);

		case 0:
			return;
	}

	var xhr = makeHttpObject();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var all_file = JSON.parse(xhr.responseText);
			all_file.file_name.forEach(addOption);
		}
	};

	xhr.open('POST', '/savefiles');
	xhr.setRequestHeader('X-CSRFToken', csrf_token[1]);
	xhr.send(formData);
	formData = new FormData(form);
}

// reusable functions

function makeHttpObject() {
	try {
		return new XMLHttpRequest();
	}
	catch (error) {
	}
	try {
		return new ActiveXObject('Msxml2.XMLHTTP');
	}
	catch (error) {
	}
	try {
		return new ActiveXObject('Microsoft.XMLHTTP');
	}
	catch (error) {
	}
	throw new Error('Could not create HTTP request object.');
}

function addOption(currentValue) {
	var option = document.createElement('option');
	option.value = option.text = currentValue;
	entryList.add(option);
}

function tester(currentValue) {
	if (/\.py$/i.test(currentValue.name)) {
		formData.append('attachments', currentValue);
	}
}