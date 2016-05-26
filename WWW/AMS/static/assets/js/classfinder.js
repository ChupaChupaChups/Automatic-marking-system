document.addEventListener("DOMContentLoaded", function () {
	var regex_class = /class\s+([^\W]+)/g;
	var regex_package = /package\s(\w+(\.?\w+)*)/g;
	var entryList = document.getElementById("id_entry_point");
	var fileUploadBtn = document.getElementById("id_attachments");
	var tempFileList;
	/**
 	 * File Uplaod Drag and Drop
	 */

	$('#submit_res').click(function(e){
		e.preventDefault();
		var formdata_temp = new FormData();
		var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
		var xhr = makeHttpObject();
		var checkedc = document.getElementById("id_language_0").checked;
		var checkedcpp = document.getElementById("id_language_1").checked;
		var checkedjava = document.getElementById("id_language_2").checked;
		var checkedpy = document.getElementById("id_language_3").checked;
		var checkedmake = document.getElementById("id_language_4").checked;
		var language;
		var entry_list = document.getElementById("id_entry_point");
		formdata_temp.append("csrfmiddlewaretoken", csrf_token[1]);
		if(checkedc) language = 1;
		else if(checkedcpp) language = 2;
		else if(checkedjava){
			formdata_temp.append("entry_point", entry_list[entry_list.selectedIndex].value);
			language = 3;
		}
		else if(checkedpy){
			formdata_temp.append("entry_point", entry_list[entry_list.selectedIndex].value);
			language = 4;
		}
		else language = 5;
		formdata_temp.append("language", language);
		var templen = 0;
		for(templen; tempFileList[templen]; templen++);
		for(var i = 0; i < templen; i++){
			formdata_temp.append("attachments", tempFileList[i]);
		}
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					location.href = xhr.responseURL;
				}
			}
		}
		xhr.open("POST", location.href);
		xhr.send(formdata_temp);
		console.log(xhr);
	});
	
	var listUl = document.getElementById("listFile");
	var fileDragUpload = document.getElementById("drop");
	$('#drop a').click(function(){
		$(this).parent().find('input').click();
	});
	fileUploadBtn.addEventListener('change', function(){
		var data = fileUploadBtn.files;
		var filelen, j = 0;
		if(tempFileList != null){
			for (filelen = 0; tempFileList[filelen]; filelen++);
			for (var i = filelen; i<filelen+data.length; i++){
				tempFileList[i] = data[j++];
			}
		}
		else{
			tempFileList = data;
		}
		console.log(tempFileList);
		for (var i = 0; i< data.length; i++){
			var tpl = $('<li class="working"><p></p><span></span></li>');
			tpl.find('p').text(data[i].name).append('<i>'+'</i>');
			tpl.appendTo(listUl);
		}
	});
	window.ondragover = function(e){e.preventDefault(); return false};
	window.ondrop = function(e){e.preventDefault(); return false};
	fileDragUpload.ondrop = function(e){
		e.preventDefault();
		var data = e.dataTransfer.files;
		if(e.dataTransfer && e.dataTransfer.files.length != 0){
			var filelen, datalen, j = 0;
			if(tempFileList != null){
				for(templen = 0; tempFileList[templen]; templen++);
				for(datalen = 0; data[datalen]; datalen++);
				for(var i = templen; i < templen+datalen; i++){
					tempFileList[i] = data[j++];
				}
			}
			else tempFileList = data;
			for(var i = 0; i<data.length; i++){
				var tpl = $('<li class="working"><p></p><span></span></li>');
				tpl.find('p').text(data[i].name).append('<i>'+'</i>');
				tpl.appendTo(listUl);
			}
		}
		var javacheck = document.getElementById("id_language_2").checked;
		var pythoncheck = document.getElementById("id_language_3").checked;
		if(javacheck) extractClass();
		if(pythoncheck) extractFiles();
	}
	fileDragUpload.ondragover = function(e){
		e.preventDefault();
	}
	/**
	 * Java의 경우 사용, 클래스의 이름을 엔트리 포인트 설정을 위해 추출.
	 */
	function extractClass() {
		// 이전목록 지움
		while (entryList.options.length) entryList.remove(0);
		var filelen;
		for (filelen = 0; fileUploadBtn.files[filelen]; filelen++);
		for (var i = 0; i < filelen; i++) {

			var re = /\.java/;
			if (re.exec(fileUploadBtn.files[i].name) != null) {
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
				reader.readAsText(fileUploadBtn.files[i]);
			}
		}
	}

	/**
	 * Python의 경우 사용, 파일들의 이름을 엔트리 포인트 설정을 위해 추출.
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
		for (filelen = 0; fileUploadBtn.files[filelen]; filelen++);
		for (var i = 0; i < filelen; i++){
			formdata.append("id_attachments", fileUploadBtn.files[i]);
		}
		var xhr = makeHttpObject();
		var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
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

	var cCheckbox = document.getElementById('id_language_0');
	var cppCheckbox = document.getElementById('id_language_1');
	var javaCheckbox = document.getElementById('id_language_2');
	var pythonCheckbox = document.getElementById('id_language_3');

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
