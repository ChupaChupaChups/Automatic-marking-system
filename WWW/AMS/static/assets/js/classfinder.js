document.addEventListener("DOMContentLoaded", function () {
	var regex = /class\s+([^\W]+)/g;
	var entryList = document.getElementById("id_entry_point");
	var fileUploadBtn = document.getElementById("id_attachments");
	/**
 	 * File Uplaod Drag and Drop
	 */
	var listUl = document.getElementById("listFile");
	var fileDragUpload = document.getElementById("drop");
	$('#drop a').click(function(){
		$(this).parent().find('input').click();
	});
	window.ondragover = function(e){e.preventDefault(); return false};
	window.ondrop = function(e){e.preventDefault(); return false};
	fileDragUpload.ondrop = function(e){
		e.preventDefault();
		var data = e.dataTransfer.files;
		if(e.dataTransfer && e.dataTransfer.files.length != 0){
				if(fileUploadBtn.files.length == 0){
					fileUploadBtn.files = data;
					console.log(fileUploadBtn.files.length);
				}
				else{
					var filelen, datalen, j = 0;
					for(templen = 0; fileUploadBtn.files[templen]; templen++);
					for(datalen = 0; data[datalen]; datalen++);
					for(var i = templen; i = templen+datalen; i++){
						fileUploadBtn.files[i] = data[j++];
					}
					console.log(fileUploadBtn.files);
				}
				for(var i = 0; i<data.length; i++){
					var tpl = $('<li class="working"><p></p><span></span></li>');
					tpl.find('p').text(data[i].name).append('<i>'+'</i>');
					tpl.appendTo(listUl);
				}
		}
		

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
//	console.log(fileUploadBtn.files);

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
	function makeHttpObject() {
      try {return new XMLHttpRequest();}
      catch (error) {}
      try {return new ActiveXObject("Msxml2.XMLHTTP");}
      catch (error) {}
      try {return new ActiveXObject("Microsoft.XMLHTTP");}
      catch (error) {}

      throw new Error("Could not create HTTP request object.");
    }
	var form = document.querySelector("form");
	fileUploadBtn.addEventListener('change',function(event){
		var formdata = new FormData(form);
		formdata.append("id_attachments", File);
		var xhr = new makeHttpObject();
		var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);

		console.log(csrf_token[1]);

		xhr.open("POST", "/savefiles");
		xhr.setRequestHeader("X-CSRFToken", csrf_token[1]);
		xhr.send(formdata);
		console.log(formdata);
	})

	/*
	 초기값을 위해 설정
	 TODO: 언어별로 다른 함수 호출 하도록 변경
	 */
	if (fileUploadBtn.value != "") extractClass();
});
