document.addEventListener("DOMContentLoaded", function () {
	var regex_class = /class\s+([^\W]+)/g;
	var regex_package = /package\s(\w+(\.?\w+)*)/g;
	var entryList = document.getElementById("id_entry_point");
	var fileUploadBtn = document.getElementById("id_attachments");

	/**
	 * Java의 경우 사용, 클래스의 이름을 엔트리 포인트 설정을 위해 추출.
	 */
	function extractClass() {
		// 이전목록 지움
		while (entryList.options.length) entryList.remove(0);
			console.log("fileUploadBtn.files : " + fileUploadBtn.files);

		for (var i = 0; i < fileUploadBtn.files.length; i++) {
			var reader = new FileReader();

			/**
			 * 파일 읽기가 완료된 경우 호출됨
			 * 정규표현식 객체 `regex`로 클래스 이름 걸러내고 선택지에 추가
			 * @param event    이벤트 객체
			 */
			reader.onload = function (event) {
				var contents = event.target.result;
				var matches_class;
				var matches_package;

				while (matches_class = regex_class.exec(contents)) {
					matches_package = regex_package.exec(contents)
					console.log(matches_package);
					var option = document.createElement("option");
					option.text = matches_package[1] +"."+ matches_class[1];
					option.value = matches_class[1];
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

			console.log("fileUploadBtn.files[i] : " + fileUploadBtn.files[i]);
			// 비동기로 파일읽기 시작
			reader.readAsText(fileUploadBtn.files.item(i));
		}
	}

	/**
	 * Python의 경우 사용, 파일들의 이름을 엔트리 포인트 설정을 위해 추출.
	 */
	var file_name = [];
	function extractFiles() {
		while (entryList.options.length) entryList.remove(0);
			for (var i = 0; i < fileUploadBtn.files.length; i++) {
				var option = document.createElement("option");
				option.text = file_name[i];
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
		xhr.onreadystatechange = function() {
        	if (xhr.readyState == XMLHttpRequest.DONE) {
            	alert(xhr.responseText);
            	//json에서 file이름만 추출
            	var re = /(\w+(\/?)\w+\.\w+)(\]?)/g;
				var str = xhr.responseText;
				var m;
				var i = 0;
				while ((m = re.exec(str)) !== null) {
					if (m.index === re.lastIndex) {
						re.lastIndex++;
					}
					file_name[i] = m[0];
					i++;

                }
            }
        }

        xhr.open('GET', '/savefiles', true);
        xhr.send(null);
		xhr.open("POST", "/savefiles");
		xhr.setRequestHeader("X-CSRFToken", csrf_token[1]);
		xhr.send(formdata);
		extractFiles();

		})


	/*
	 초기값을 위해 설정
	 TODO: 언어별로 다른 함수 호출 하도록 변경
	 */
	if (fileUploadBtn.value != "") extractClass();
});
