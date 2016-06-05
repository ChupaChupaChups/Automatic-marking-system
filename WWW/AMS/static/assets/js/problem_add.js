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
	var infileUploadBtn = document.getElementById("id_inputfile");
	var infolderUploadBtn = document.getElementById("id_inputfolder");
 	var outfileUploadBtn = document.getElementById("id_outputfile");
	var outfolderUploadBtn = document.getElementById("id_outputfolder");

	var tempFileList = fileUploadBtn.files;
	var tempFolderList = folderUploadBtn.files;
	var tempinFileList = infileUploadBtn.files;
	var tempinFolderList = infolderUploadBtn.files;
	var tempoutFileList = outfileUploadBtn.files;
	var tempoutFolderList = outfolderUploadBtn.files;

	var printFileList, printFileList;
	var mapPath={}, inmapPath={}, outmapPath={};
	var tabNum = 1;

	var fileDragUpload = document.getElementById("dropfile_ic");
	var folderDragUpload = document.getElementById("dropfolder_ic");
	var infileDragUpload = document.getElementById("inputfile_ic");
	var infolderDragUpload = document.getElementById("inputfolder_ic");
	var outfileDragUpload = document.getElementById("outputfile_io");
	var outfolderDragUpload = document.getElementById("outputfolder_io");

	/** language in input + code tab **/
	var cCheckbox = document.getElementById('id_language_0');
	var cppCheckbox = document.getElementById('id_language_1');
	var javaCheckbox = document.getElementById('id_language_2');
	var pythonCheckbox = document.getElementById('id_language_3');
	var makefileCheckbox = document.getElementById("id_language_4");

console.log("file",fileDragUpload,"folder",folderDragUpload,"infile",infileDragUpload,"infolder",infolderDragUpload,"outfile",outfileDragUpload,"outfolder",outfolderDragUpload);

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

		var filelen = 0, folderlen = 0, infilelen = 0, infolderlen = 0, outfilelen = 0, outfolderlen = 0;
		/** answer code file_folder **/
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
		/** input file_folder **/
		for (infilelen; tempinFileList[infilelen]; infilelen++);
		for (var i = 0; i < infilelen; i++){
			formdata_temp.append("inputFile", tempinFileList[i]);
		}
		for (infolderlen; tempinFolderList[infolderlen]; infolderlen);
		for (var i = 0; i< infolderlen; i++){
			formdata_temp.append("inputFolder", tempinFolderList[i]);
			if (tempinFolderList[i].webkitRelativePath == "") {
				formdata_temp.append(tempinFolderList[i].name, inmapPath[tempinFolderList[i].name]);
			}
			else formdata_temp.append(tempinFolderList[i].webkitRelativePath, "");
		}
		/** output file_folder **/
		for (outfilelen; tempoutFileList[outfilelen];outfilelen);
		for (var i = 0; i < outfilelen; i++){
			formdata_temp.append("outputFile", tempoutFileList[i]);
		}
		for (outfolderlen; tempoutFolderList[outfolderlen]; outfolderlen);
		for (var i = 0; i < outfolderlen; i++){
			formdata_temp.append("outputFolder", tempoutFolderList[i]);
			if (tempoutFolderList[i].webkitRelativePath == "") {
				formdata_temp.append(tempoutFolderList[i].name, outmapPath[tempoutFolderList[i].name]);
			}
			else formdata_temp.append(tempoutFolderList[i].webkitRelativePath, "");
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

	var listUl = document.getElementById("listFile_ic");
	var inlistUl = document.getElementById("inputlistFile_ic");
	var outlistUl = document.getElementById("outputlistFile_io");

	/** input + code tab**/
	$('#dropfile_ic').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	$('#dropfolder_ic').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	$('#inputfile_ic').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	$('#inputfolder_ic').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	/** only code tab **/
	$('#dropfile_oc').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	$('#dropfolder_oc').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	/** input + output tab **/
	$('#inputfile_io').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	$('#inputfolder_io').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	$('#outputfile_io').find('a').click(function () {
		$(this).parent().find('input').click();
	});
	$('#outputfolder_io').find('a').click(function () {
		$(this).parent().find('input').click();
	});

	/** answer code, input example, output example upload **/
	function fileUpBtn(fileBtn, fileList, Ul){
			var data = fileBtn.files;
			var filelen, j = 0;
			if(fileList != null){
				for (filelen = 0; fileList[filelen]; filelen++);
				for (var i = filelen; i < filelen + data.length; i++, j++) {
					fileList[i] = data[j];
				}
			}
			else {
				fileList = data;
			}
			for (var i=0; i < data.length; i++){
				var tpl = $('<li class="working"><p></p><span></span></li>');
				tpl.find('p').text(data[i].name).append('<i>' + '</i>');
				tpl.appendTo(Ul);
			}
			//console.log("click file:", fileList);
	}
	function folderUpBtn(folderBtn, folderList, map, Ul){
			var data = folderBtn.files;
			var filelen, j = 0;
			if(folderList != null){
				for (filelen = 0; folderList[filelen]; filelen++);
				for (var i = filelen; i < filelen + data.length; i++, j++) {
					folderList[i] = data[j];
					if (map[data[j].webkitRelativePath] == undefined) map[data[j].webkitRelativePath] = [];
					map[data[j].webkitRelativePath].push(data[j].webkitRelativePath);
				}
			}
			else {
				folderList = data;
			}
			for (var i=0; i < data.length; i++){
				var tpl = $('<li class="working"><p></p><span></span></li>');
				tpl.find('p').text(data[i].webkitRelativePath).append('<i>' + '</i>');
				tpl.appendTo(Ul);
			}
			//console.log("click folder:", folderList);
	}

	fileUploadBtn.addEventListener('change', function() {
		fileUpBtn(fileUploadBtn, tempFileList, listUl);
		console.log("click file:", tempFileList);
	});
	folderUploadBtn.addEventListener('change', function() {
		folderUpBtn(folderUploadBtn, tempFolderList, mapPath, listUl);
		console.log("click folder:", tempFolderList);
	});
	infileUploadBtn.addEventListener('change', function(){
		fileUpBtn(infileUploadBtn, tempinFileList, inlistUl);
		console.log("click infile:", tempinFileList);
	});
	infolderUploadBtn.addEventListener('change', function() {
		folderUpBtn(infolderUploadBtn, tempinFolderList, inmapPath, inlistUl);
		console.log("click infolder:", tempinFolderList);
	});
	outfileUploadBtn.addEventListener('change', function(){
		fileUpBtn(outfileUploadBtn, tempoutFileList, outlistUl);
		console.log("click outfile:", tempoutFileList);
	});
	outfolderUploadBtn.addEventListener('change', function() {
		folderUpBtn(outfolderUploadBtn, tempoutFolderList, outmapPath, outlistUl);
		console.log("click outfolder:", tempoutFolderList);
	});

	/** prevent to open droped file **/
	window.ondragover = function (e) {
		e.preventDefault();
		return false
	};
	window.ondrop = function (e) {
		e.preventDefault();
		return false
	};

	/** recursive search in uploaded folder **/
	function traverseFileTree(item, folderList, map, Ul, path) {
		var templen;
		path = path || "";
		if (item.isFile) {
			item.file(
				function (file) {
					for (templen = 0; folderList[templen]; templen++);
					console.log(templen);
					folderList[templen] = file;
					if (map[file.name] == undefined) {
						map[file.name] = [];
					}
					map[file.name].push(path);
				}
			);
			//console.log(tempFolderList);
			var tpl = $('<li class="working"><p></p><span></span></li>');
			tpl.find('p').text(item.fullPath).append('<i>' + '</i>');
			tpl.appendTo(Ul);
			//	tempFileList[templen].webkitRelativePath = item.fullPath;
		}
		else if (item.isDirectory) {
			var dirReader = item.createReader();
			dirReader.readEntries(function (entries) {
				for (var i = 0; i < entries.length; i++) {
					traverseFileTree(entries[i], folderList, map, Ul, path + item.name + "/");
				}
			});
		}
	}

	/** file Drag Upload **/

	fileDragUpload.ondragover = function (e) {
		e.preventDefault();
	};
	infileDragUpload.ondragover = function (e) {
		e.preventDefault();
	};
	outfileDragUpload.ondragover = function (e) {
		e.preventDefault();
	};

	function fileDrag(dataTransfer, fileList, Ul){
		if (dataTransfer && dataTransfer.files.length != 0) {
			var data = dataTransfer.files;
			if (fileList != null) {
				var templen, j = 0;
				for (templen = 0; fileList[templen]; templen++);
				for (var i = templen; i < templen + data.length; i++) {
					fileList[i] = data[j++];
				}
			}
			else fileList = data;

			for (var i = 0; i < data.length; i++) {
				var tpl = $('<li class="working"><p></p></li>');
				tpl.find('p').text(data[i].name).append('<i>' + '</i>');
				tpl.appendTo(Ul);
			}
		}
		//console.log("drag file:",fileList);
		if (javaCheckbox.checked) extractClass();
		if (pythonCheckbox.checked) extractFiles();
	}

	fileDragUpload.ondrop = function (e) {
		e.preventDefault();
		fileDrag(e.dataTransfer, tempFileList, listUl);
		console.log("drag file:",tempFileList);
	};
	infileDragUpload.ondrop = function (e) {
		e.preventDefault();
		fileDrag(e.dataTransfer, tempinFileList, inlistUl);
		console.log("drag infile:",tempinFileList);
	};
	outfileDragUpload.ondrop = function (e) {
		e.preventDefault();
		fileDrag(e.dataTransfer, tempoutFileList, outlistUl);
		console.log("drag outfile:",tempoutFileList);
	};
	
	/** folder Drag Upload **/
	folderDragUpload.ondragover = function (e) {
		e.preventDefault();
	};
	infolderDragUpload.ondragover = function (e) {
		e.preventDefault();
	};
	outfolderDragUpload.ondragover = function (e) {
		e.preventDefault();
	};

	function folderDrag(dataTransfer, folderList, map, Ul){
		if (dataTransfer && dataTransfer.files.length != 0) {
			var items = dataTransfer.items;
			for (var i = 0; i < items.length; i++) {
				var item = items[i].webkitGetAsEntry();
				if (item) {
					traverseFileTree(item, folderList, map, Ul);
				}
			}
		}
		//console.log("drag folder:",tempFolderList);
		if (javaCheckbox.checked) extractClass();
		if (pythonCheckbox.checked) extractFiles();
	}
	
	folderDragUpload.ondrop = function (e) {
		e.preventDefault();
		folderDrag(e.dataTransfer, tempFolderList, mapPath, listUl);
		console.log("drag folder:", tempFolderList);
	};
	infolderDragUpload.ondrop = function (e) {
		e.preventDefault();
		folderDrag(e.dataTransfer, tempinFolderList, inmapPath, inlistUl);
		console.log("drag infolder:", tempinFolderList);
	};
	outfolderDragUpload.ondrop = function (e) {
		e.preventDefault();
		folderDrag(e.dataTransfer, tempoutFolderList, outmapPath, outlistUl);
		console.log("drag outfolder:", tempoutFolderList);
	};


	document.getElementById('in_co').addEventListener('click',function(event){ 
		console.log("tab 1 clicked");
		tabNum = 1;
		fileDragUpload = document.getElementById("dropfile_ic");
		folderDragUpload = document.getElementById("dropfolder_ic");
		infileDragUpload = document.getElementById("inputfile_ic");
		infolderDragUpload = document.getElementById("inputfolder_ic");
		outfileDragUpload = "\0";
		outfolderDragUpload = "\0";

		tempFileList = fileUploadBtn.files;
		tempFolderList = folderUploadBtn.files;
		tempinFileList = infileUploadBtn.files;
		tempinFolderList = infolderUploadBtn.files;
		tempoutFileList = "\0";
		tempoutFolderList = "\0";

		cCheckbox = document.getElementById('id_language_0');
		cppCheckbox = document.getElementById('id_language_1');
		javaCheckbox = document.getElementById('id_language_2');
		pythonCheckbox = document.getElementById('id_language_3');
		makefileCheckbox = document.getElementById("id_language_4");

		listUl = document.getElementById("listFile_ic");
		inlistUl = document.getElementById("inputlistFile_ic");
		outlistUl = "\0";
	});
	document.getElementById('only_co').addEventListener('click',function(event){ 
		console.log("tab 2 clicked");
		tabNum = 2; 
		fileDragUpload = document.getElementById("dropfile_oc");
		folderDragUpload = document.getElementById("dropfolder_oc");
		infileDragUpload = "\0";
		infolderDragUpload = "\0";
		outfileDragUpload = "\0";
		outfolderDragUpload = "\0";

		tempFileList = fileUploadBtn.files;
		tempFolderList = folderUploadBtn.files;
		tempinFileList = "\0";
		tempinFolderList = "\0";
		tempoutFileList = "\0";
		tempoutFolderList = "\0";

		cCheckbox = document.getElementById('id_language_00');
		cppCheckbox = document.getElementById('id_language_11');
		javaCheckbox = document.getElementById('id_language_22');
		pythonCheckbox = document.getElementById('id_language_33');
		makefileCheckbox = document.getElementById("id_language_44");

		listUl = document.getElementById("listFile_oc");
		inlistUl = "\0";
		outlistUl = "\0";
	});
	document.getElementById('in_out').addEventListener('click',function(event){ 
		console.log("tab 3 clicked");
		tabNum = 3; 
		fileDragUpload = "\0";
		folderDragUpload = "\0";
		infileDragUpload = document.getElementById("inputfile_io");
		infolderDragUpload = document.getElementById("inputfolder_io");
		outfileDragUpload = document.getElementById("outputfile_io");
		outfolderDragUpload = document.getElementById("outputfolder_io");

		tempFileList = "\0";
		tempFolderList = "\0";
		tempinFileList = infileUploadBtn.files;
		tempinFolderList = infolderUploadBtn.files;
		tempoutFileList = outfileUploadBtn.files;
		tempoutFolderList = outfolderUploadBtn.files;

		listUl = "\0";
		inlistUl = document.getElementById("inputlistFile_io");
		outlistUl = document.getElementById("outputlistFile_io");
	});


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

		exClass(printFileList, tempFileList);
	}
	function exClass(printFile, fileList){
		var filelen, folderlen, j = 0;
		for (folderlen = 0; fileList[folderlen]; folderlen++);
		for (filelen = 0; fileList[filelen]; filelen++);
		for (var i = folderlen; i < filelen + folderlen; i++) {
			fileList[i] = fileList[j++];
		}
		for (var i = 0; i < filelen + folderlen; i++) {

			var re = /\.java/;
			if (re.exec(fileList[i].name) != null) {
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
				reader.readAsText(fileList[i]);
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

		printFileList = tempFolderList;

		exFiles(printFileList, tempFileList);
	}
	function exFiles(printFile, fileList) {
		var formdata = new FormData(form);
		var filelen, folderlen, j = 0;
		for (folderlen = 0; printFile[folderlen]; folderlen++);
		for (filelen = 0; fileList[filelen]; filelen++);
		for (var i = folderlen; i < filelen + folderlen; i++) {
			printFile[i] = fileList[j++];
		}
		for (var i = 0; i < filelen + folderlen; i++) {
			formdata.append("id_attachments", printFile[i]);
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
