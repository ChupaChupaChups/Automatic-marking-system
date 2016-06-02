document.addEventListener("DOMContentLoaded", function () {
	/**
	 * File Upload Drag and Drop
	
	function makeHttpObject(){
		try{
			return new XMLHttpRequest();
		catch(error){
		}
		try{
			return new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(error){
		}
		try{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch(error){
		}
		throw new Error("Could not create HTTP request object.");
	}	
	$('#save_problem').click(function(e){
		e.preventDefault();
		var formdata = new FormData();
		var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
		var xhr = makeHttpObject();
		var c_ok = document.getElementById('id_p_c_ok').checked;
		var cpp_ok = document.getElementById('id_p_cpp_ok').checked;	
		var java_ok = document.getElementById('id_p_java_ok').checked;
		var py_ok = document.getElementById('id_p_py_ok').checked;
		formdata.append("csrfmiddlewaretoken", csrf_token[1]);
		formdata.append("c_ok", c_ok);
		formdata.append("cpp_ok", cpp_ok);
		formdata.append("java_ok", java_ok);
		formdata.append("py_ok", py_ok);
		
		
	});
	*/
	/**
	 * Visable Unvisable method
	 */
	var content = document.getElementById('p_content');
	content.style.display = 'none';

	var regex_class = /class\s+([^\W]+)/g;
	var regex_package = /package\s(\w+(\.?\w+)*)/g;
	var entryList = document.getElementById("id_entry_point");
	var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
	var fileUploadBtn = document.getElementById("id_answercodeFile");
	var folderUploadBtn = document.getElementById("id_answercodeFolder");
	var tempFileList = fileUploadBtn.files;
	var tempFolderList = folderUploadBtn.files;
	var printFileList;
	var mapPath={};
	var fileDragUpload = document.getElementById("dropfile");
	var folderDragUpload = document.getElementById("dropfolder");

	var cCheckbox = document.getElementById('id_language_0');
	var cppCheckbox = document.getElementById('id_language_1');
	var javaCheckbox = document.getElementById('id_language_2');
	var pythonCheckbox = document.getElementById('id_language_3');
	var makefileCheckbox = document.getElementById("id_language_4");




	document.getElementById('content').addEventListener('click', function (event) {
		if (event.target.checked) content.style.display = 'block';
		else content.style.display = 'none';
	});
	
	var answercode = document.getElementById('answer_code_upload');
	answercode.style.display = 'none';
	
	document.getElementById('answer_code').addEventListener('click', function (event){
		if (event.target.checked) answercode.style.display = 'block';
		else answercode.style.display = 'none';
	});
	
	var inputfiles = document.getElementById('input_file_upload');
	inputfiles.style.display = 'none';

	document.getElementById('input_file').addEventListener('click', function (event){
		if (event.target.checked) inputfiles.style.display = 'block';
		else inputfiles.style.display = 'none';
	});
	
	var inputfiles2 = document.getElementById('input_file_upload2');
	inputfiles2.style.display = 'none';

	document.getElementById('input_file2').addEventListener('click', function (event){
		if (event.target.checked) inputfiles2.style.display = 'block';
		else inputfiles2.style.display = 'none';
	});	
	var outputfiles = document.getElementById('output_file_upload');
	outputfiles.style.display = 'none';
	
	document.getElementById('output_file').addEventListener('click', function (event){
		if (event.target.checked) outputfiles.style.display = 'block';
		else outputfiles.style.display = 'none';
	});	
	document.getElementById('minus').addEventListener('click',function(event){
		document.getElementById("hintBar").value -= 5;
		if (document.getElementById("hintBar").value == 0) document.getElementById("percent").innerHTML = "항상 힌트를 보여줍니다";
		else document.getElementById("percent").innerHTML = document.getElementById("hintBar").value + "% 이상 맞으면 힌트보여주기";
	});
	document.getElementById('plus').addEventListener('click',function(event){
                document.getElementById("hintBar").value += 5;
		if (document.getElementById("hintBar").value == 100) document.getElementById("percent").innerHTML = "힌트를 보여주지 않습니다";
		else document.getElementById("percent").innerHTML = document.getElementById("hintBar").value + "% 이상 맞으면 힌트보여주기";
	});

	var submit_res = document.getElementById('save_problem');
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

		var filelen = 0, folderlen = 0;
		for (filelen; tempFileList[filelen]; filelen++);
		for (var i = 0; i < filelen; i++) {
			formdata_temp.append("answercodeFile", tempFileList[i]);
		}
		for (folderlen; tempFolderList[folderlen]; folderlen++);
		for (var i = 0; i < folderlen; i++) {
			formdata_temp.append("answercodeFolder", tempFolderList[i]);
			if (tempFolderList[i].webkitRelativePath == "") {
				formdata_temp.append(tempFolderList[i].name, mapPath[tempFolderList[i].name]);
			}
			else formdata_temp.append(tempFolderList[i].webkitRelativePath, "");
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
	$('#dropfile').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	$('#dropfolder').find('a').click(function () {
		$(this).parent().find('input').click();
	});

	folderUploadBtn.addEventListener('change', function () {
		var data = folderUploadBtn.files;
		var filelen, j = 0;
		if (tempFolderList != null) {
			for (filelen = 0; tempFolderList[filelen]; filelen++);
			for (var i = filelen; i < filelen + data.length; i++, j++) {
				tempFolderList[i] = data[j];
				if (mapPath[data[j].webkitRelativePath] == undefined) mapPath[data[j].webkitRelativePath] = [];
				mapPath[data[j].webkitRelativePath].push(data[j].webkitRelativePath);
			}
		}
		else {
			tempFolderList = data;
		}
		for (var i = 0; i < data.length; i++) {
			var tpl = $('<li class="working"><p></p><span></span></li>');
			tpl.find('p').text(data[i].webkitRelativePath).append('<i>' + '</i>');
			tpl.appendTo(listUl);
		}
		console.log("click folder:",tempFolderList);
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
		//console.log(tempFileList);
		for (var i = 0; i < data.length; i++) {
			var tpl = $('<li class="working"><p></p><span></span></li>');
			tpl.find('p').text(data[i].name).append('<i>' + '</i>');
			tpl.appendTo(listUl);
		}
		console.log("click file:",tempFileList);
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
			item.file(
				function (file) {
					for (templen = 0; tempFolderList[templen]; templen++);
					console.log(templen);
					tempFolderList[templen] = file;
					if (mapPath[file.name] == undefined) {
						mapPath[file.name] = [];
					}
					mapPath[file.name].push(path);
				}
			);
			//console.log(tempFolderList);
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
			var data = e.dataTransfer.files;
			if (tempFileList != null) {
				var templen, j = 0;
				for (templen = 0; tempFileList[templen]; templen++);
				for (var i = templen; i < templen + data.length; i++) {
					tempFileList[i] = data[j++];
				}
			}
			else tempFileList = data;

			for (var i = 0; i < data.length; i++) {
				var tpl = $('<li class="working"><p></p></li>');
				tpl.find('p').text(data[i].name).append('<i>' + '</i>');
				tpl.appendTo(listUl);
			}
		}
		console.log("drag file:",tempFileList);
		if (javaCheckbox.checked) extractClass();
		if (pythonCheckbox.checked) extractFiles();
	};
	fileDragUpload.ondragover = function (e) {
		e.preventDefault();
	};
	folderDragUpload.ondrop = function (e) {
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
		console.log("drag folder:",tempFolderList);
		if (javaCheckbox.checked) extractClass();
		if (pythonCheckbox.checked) extractFiles();
	};
	folderDragUpload.ondragover = function (e) {
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
		printFileList = tempFolderList;
		var filelen, folderlen, j = 0;
		for (folderlen = 0; printFileList[folderlen]; folderlen++);
		for (filelen = 0; tempFileList[filelen]; filelen++);
		for (var i = folderlen; i < filelen + folderlen; i++) {
			printFileList[i] = tempFileList[j++];
		}
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

	function extractFiles() {
		while (entryList.options.length) entryList.remove(0);
		var formdata = new FormData(form);
		printFileList = tempFolderList;
		var filelen, folderlen, j = 0;
		for (folderlen = 0; printFileList[folderlen]; folderlen++);
		for (filelen = 0; tempFileList[filelen]; filelen++);
		for (var i = folderlen; i < filelen + folderlen; i++) {
			printFileList[i] = tempFileList[j++];
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


	javaCheckbox.addEventListener('change', function (event) {
		if (event.target.checked) {
			extractClass();
			fileUploadBtn.addEventListener('change', extractClass);
			folderUploadBtn.addEventListener('change', extractClass);
		} else {
			fileUploadBtn.removeEventListener('change', extractClass);
			folderUploadBtn.removeEventListener('change', extractClass);
		}
	});

	pythonCheckbox.addEventListener('change', function (event) {
		if (event.target.checked) {
			extractFiles();
			fileUploadBtn.addEventListener('change', extractFiles);
			folderUploadBtn.addEventListener('change', extractFiles);
		} else {
			fileUploadBtn.removeEventListener('change', extractFiles);
			folderUploadBtn.addEventListener('change', extractFiles);
		}
	});


	/*
	 초기값을 위해 설정
	 TODO: 언어별로 다른 함수 호출 하도록 변경
	 */
	if (fileUploadBtn.value != "") extractClass();

});
