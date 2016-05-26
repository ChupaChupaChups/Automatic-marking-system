// TODO: Convert Jquery to pure JavaScript
// FIXME: 언어 선택을 여러번 바꿀 경우 서버에 DDOS급 테러가 이뤄집!!!

document.addEventListener("DOMContentLoaded", function () {
	var regex_class = /class\s+([^\W]+)/g;
	var regex_package = /package\s(\w+(\.?\w+)*)/g;
	var entryList = document.getElementById("id_entry_point");
	var fileUploadBtn = document.getElementById("id_attachments");
	var tempFileList = fileUploadBtn.files;
	var mapPath = {};
	var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
	
	var cCheckbox = document.getElementById('id_language_0');
	var cppCheckbox = document.getElementById('id_language_1');
	var javaCheckbox = document.getElementById('id_language_2');
	var pythonCheckbox = document.getElementById('id_language_3');
	var makefileCheckbox = document.getElementById("id_language_4");

	/**
	 * File Uplaod Drag and Drop
	 *
	 * TODO: code refactoring
	 */
	var submit_res = document.getElementById('submit_res');
	submit_res.addEventListener('click', function (e) {
		e.preventDefault();
		var formdata_temp = new FormData();
		var xhr = makeHttpObject();
		var checkedc = cCheckbox.checked;
		var checkedcpp = cppCheckbox.checked;
		var checkedjava = javaCheckbox.checked;
		var checkedpy = pythonCheckbox.checked;
		var checkedmake = makefileCheckbox.checked;
		var language;

		formdata_temp.append("csrfmiddlewaretoken", csrf_token[1]);
		if (checkedc) language = 1;
		else if (checkedcpp) language = 2;
		else if (checkedjava) {
			formdata_temp.append("entry_point", entryList[entryList.selectedIndex].value);
			language = 3;
		}
		else if (checkedpy) {
			formdata_temp.append("entry_point", entryList[entryList.selectedIndex].value);
			language = 4;
		}
		else language = 5;
		formdata_temp.append("language", language);

		var templen = 0;
		for (templen; tempFileList[templen]; templen++);
		for (var i = 0; i < templen; i++) {
			formdata_temp.append("attachments", tempFileList[i]);
			formdata_temp.append(tempFileList[i].name, mapPath[tempFileList[i].name]);
		}
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					location.href = xhr.responseURL;
				}
			}
		};
		xhr.open("POST", location.href);
		xhr.send(formdata_temp);
		console.log(xhr);
	});

	var listUl = document.getElementById("listFile");
	var fileDragUpload = document.getElementById("drop");
	$('#drop').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	fileUploadBtn.addEventListener('change', function () {
		var data = fileUploadBtn.files;
		var filelen, j = 0;
		if (tempFileList != null) {
			for (filelen = 0; tempFileList[filelen]; filelen++);
			for (var i = filelen; i < filelen + data.length; i++) {
				tempFileList[i] = data[j++];
			}
		}
		else {
			tempFileList = data;
		}
		console.log(tempFileList);
		for (var i = 0; i < data.length; i++) {
			var tpl = $('<li class="working"><p></p><span></span></li>');
			tpl.find('p').text(data[i].name).append('<i>' + '</i>');
			tpl.appendTo(listUl);
		}
	});
	window.ondragover = function (e) {
		e.preventDefault();
		return false
	};
	window.ondrop = function (e) {
		e.preventDefault();
		return false
	};
	function traverseFileTree(item, path) {
		var templen;
		path = path || "";
		if (item.isFile) {
			if (tempFileList != null) {
				item.file(
					function (file) {
						for (templen = 0; tempFileList[templen]; templen++);
						tempFileList[templen] = file;
						if (mapPath[file.name] == undefined) {
							mapPath[file.name] = [];
						}
						mapPath[file.name].push(path);
					}
				);
			}
			console.log(tempFileList);
			var tpl = $('<li class="working"><p></p><span></span></li>');
			tpl.find('p').text(item.fullPath).append('<i>' + '</i>');
			tpl.appendTo(listUl);
			//	tempFileList[templen].webkitRelativePath = item.fullPath;
		}
		else if (item.isDirectory) {
			var dirReader = item.createReader();
			dirReader.readEntries(function (entries) {
				for (var i = 0; i < entries.length; i++) {
					traverseFileTree(entries[i], path + item.name + "/");
				}
			});
		}
	}

	fileDragUpload.ondrop = function (e) {
		e.preventDefault();
		if (e.dataTransfer && e.dataTransfer.files.length != 0) {
			var items = e.dataTransfer.items;
			for (var i = 0; i < items.length; i++) {
				var item = items[i].webkitGetAsEntry();
				if (item) {
					traverseFileTree(item);
				}
			}
		}
		
		if (javaCheckbox.checked) extractClass();
		if (pythonCheckbox.checked) extractFiles();
	};
	fileDragUpload.ondragover = function (e) {
		e.preventDefault();
	};

	/**
	 * Java의 경우 사용, 클래스의 이름을 엔트리 포인트 설정을 위해 추출.
	 *
	 * TODO: main()이 있는 클래스만 엔트리 포인트 목록에 추가하도록 수정
	 * TODO: main()이 하나인 경우 자동으로 그 클래스를 엔트리 포인트로 사용하도는 기능 추가
	 */
	function extractClass() {
		// 이전목록 지움
		while (entryList.options.length) entryList.remove(0);
		var filelen;
		for (filelen = 0; tempFileList[filelen]; filelen++);
		for (var i = 0; i < filelen; i++) {

			var re = /\.java/;
			if (re.exec(tempFileList[i].name) != null) {
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
//					console.log("option txt : " + option.text);
						entryList.add(option);

//					console.log("add option do ? option : " + option);
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
				reader.readAsText(tempFileList[i]);
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

	function extractFiles() {
		while (entryList.options.length) entryList.remove(0);
		var formdata = new FormData(form);
		var filelen;
		for (filelen = 0; tempFileList[filelen]; filelen++);
		for (var i = 0; i < filelen; i++) {
			formdata.append("id_attachments", tempFileList[i]);
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


	javaCheckbox.addEventListener('change', function (event) {
		if (event.target.checked) {
			extractClass();
			fileUploadBtn.addEventListener('change', extractClass);
		} else {
			fileUploadBtn.removeEventListener('change', extractClass);
		}
	});

	pythonCheckbox.addEventListener('change', function (event) {
		if (event.target.checked) {
			extractFiles();
			fileUploadBtn.addEventListener('change', extractFiles);
		} else {
			fileUploadBtn.removeEventListener('change', extractFiles);
		}
	});


	/*
	 초기값을 위해 설정
	 TODO: 언어별로 다른 함수 호출 하도록 변경
	 */
	if (fileUploadBtn.value != "") extractClass();


});
