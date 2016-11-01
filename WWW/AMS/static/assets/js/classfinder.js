var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);

/**
 * Java의 경우 사용, 클래스의 이름을 엔트리 포인트 설정을 위해 추출.
 *
 * TODO: main()이 있는 클래스만 엔트리 포인트 목록에 추가하도록 수정
 * TODO: main()이 하나인 경우 자동으로 그 클래스를 엔트리 포인트로 사용하는 기능 추가
 * TODO: main()이 하나인 경우 entry point 리스트를 끄도록 수정
 */
function extractClass(fileList, folderList, entryList) {
	console.log(entryList);
	console.log(folderList);
	console.log(fileList);
	// 이전목록 지움
	while (entryList.options.length) entryList.remove(0);

	// 추가된 개별 파일과 폴더 하나로 합침
	var printFileList = [], i;
	for (i = 0; i < folderList.length; i++) {
		if (/\.java$/i.test(folderList[i].name)) {
			printFileList.push(folderList[i]);
		}
	}
	for (i = 0; i < fileList.length; i++) {
		console.log(fileList[i].name);
		if (/\.java$/i.test(fileList[i].name)) {
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
			console.log(contents);
			var matches_package = /package\s+(\w+(\.\w+)*)/g.exec(contents);
			console.log(matches_package);
			var class_extractor = /class\s+(\w+)\s*\{((\s|.)*)}/g;
			console.log(class_extractor);
			var matches_class;
			while (matches_class = class_extractor.exec(contents)) {
				console.log(matches_class);
				var main_tester = /public\s+static\s+void\s+main\s*\(\s*String(\s+)?(\[]|\.\.\.)\s*\w+\)/g;
				if (main_tester.test(matches_class[2])) {
					var result = null;
					if (matches_package) {
						result = matches_package[1] + '.' + matches_class[1];
					} else {
						result = matches_class[1];
					}

					var option = document.createElement('option');
					option.value = option.text = result;
					console.log(option);
					entryList.add(option);
				}
				else{
					var result = null;
					if(matches_package){
						result = matches_package[1] + '.' + matches_class[1];
					}
					else{
						result = matches_class[1];
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
			console.log(option);
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