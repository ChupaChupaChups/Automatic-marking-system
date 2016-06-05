// TODO: Convert Jquery to pure JavaScript
// FIXME: 언어 선택을 여러번 바꿀 경우 서버에 DDOS급 테러가 이뤄집!!!
// FIXME: 폴더 Drag & Drop는 잘 되지만 클릭으로 올리면 저장에 에러

/**
 * Java의 경우 사용, 클래스의 이름을 엔트리 포인트 설정을 위해 추출.
 *
 * TODO: main()이 있는 클래스만 엔트리 포인트 목록에 추가하도록 수정
 * TODO: main()이 하나인 경우 자동으로 그 클래스를 엔트리 포인트로 사용하도는 기능 추가
 */
var regex_class = /class\s+([^\W]+)/g;
var regex_package = /package\s(\w+(\.?\w+)*)/g;
var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
function extractClass(fileList, folderList, entryList) {
	// 이전목록 지움

	console.log("inFileList ", fileList);
	console.log("infolderList ", folderList);
	while (entryList.options.length) entryList.remove(0);
	var printFileList = [];
	var filelen, folderlen, j = 0;
	for (folderlen = 0; folderList[folderlen]; folderlen++);
	for (var i = 0; i< folderlen; i++){
		printFileList.push(folderList[i]);
	}
	for (filelen = 0; fileList[filelen]; filelen++);
	for (var i = 0; i < filelen; i++) {
		printFileList.push(fileList[i]);
	}
	console.log("printFileList", printFileList);
	for (var i = 0; i < filelen + folderlen; i++) {
			var re = /\.java/;
		if (re.exec(printFileList[i].name) != null) {
			var reader = new FileReader();
			/**
			 * 파일 읽기가 완료된 경우 호출됨
			 * 정규표현식 객체 `regex`로 클래스 이름 걸러내고 선택지에 추가
			 * @param event    이벤트 객체
			 */
			reader.onload = function (event) {
				var contents = event.target.result;
				var matches_class;
				var matches_package = regex_package.exec(contents);
				while (matches_class = regex_class.exec(contents)) {
					console.log(matches_class);
					var option = document.createElement("option");
					if (matches_package) {
						option.text = matches_package[1] + "." + matches_class[1];
					} else {
						option.text = matches_class[1];
					}
					option.value = matches_class[1];
	//				console.log("option txt : " + option.text);
					entryList.add(option);
	//				console.log("add option do ? option : " + option);
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
				// 비동기로 파일읽기 시작
			reader.readAsText(printFileList[i]);
		}
	}
}

/**
 * Python의 경우 사용, 파일들의 이름을 엔트리 포인트 설정을 위해 추출.
 *
 * TODO: 브라우저가 상대경로를 지원 할 경우 HTTP request를 보내지 않고 그 기능을 바로 사용하도록 수정
 */
var all_file = [];
var py_file_name = [];

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

var form = document.querySelector("form");

function extractFiles(fileList, folderList, entryList) {
	while (entryList.options.length) entryList.remove(0);
	var formdata = new FormData(form);
	var printFileList = [];
	var filelen, folderlen;
	for (folderlen = 0; printFileList[folderlen]; folderlen++);
	for (var i = 0; i < folderlen; i++){
		printFileList.push(folderList[i]);
	}
	for (filelen = 0; fileList[filelen]; filelen++);
	for (var i = 0; i < filelen; i++) {
		printFileList.push(fileList[i]);
	}
	for (var i = 0; i < filelen + folderlen; i++) {
		formdata.append("id_attachments", printFileList[i]);
	}
	var xhr = makeHttpObject();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var json = xhr.responseText;
			all_file = JSON.parse(json);
			var re = /\.py/;
			var j = 0;
			for (var i = 0; i < all_file.file_name.length; i++) {
				if (re.exec(all_file.file_name[i]) != null) {
					py_file_name.push(all_file.file_name[i]);
				}
			}
			for (var i = 0; i < py_file_name.length; i++) {
				var option = document.createElement("option");
				option.text = py_file_name[i];
				option.value = py_file_name[i];
				entryList.add(option);
			}
		}
	};
	xhr.open("POST", "/savefiles");
	xhr.setRequestHeader("X-CSRFToken", csrf_token[1]);
	xhr.send(formdata);
}


