var entryList = document.getElementById("id_entry_point");

var fileUploadBtn = document.getElementById("id_attachments_file");
var folderUploadBtn = document.getElementById("id_attachments_folder");
var tempFileList = [];
var tempFolderList = [];
var mapPath = {};
var fileDragUpload = document.getElementById("dropfile");
var folderDragUpload = document.getElementById("dropfolder");

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

	for (var i = 0; i < tempFileList.length; i++) {
		formdata_temp.append("attachments_file", tempFileList[i]);
	}
	for (var i = 0; i < tempFolderList.length; i++) {
		formdata_temp.append("attachments_folder", tempFolderList[i]);
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
	tempFolderList = folderUpBtn(folderUploadBtn, tempFolderList, mapPath, listUl);
});

fileUploadBtn.addEventListener('change', function () {
	tempFileList = fileUpBtn(fileUploadBtn, tempFileList, listUl);
});

window.ondragover = function (e) {
	e.preventDefault();
	return false
};
window.ondrop = function (e) {
	e.preventDefault();
	return false
};

fileDragUpload.ondrop = function (e) {
	e.preventDefault();
	tempFileList = fileDrag(e.dataTransfer, tempFileList, listUl);
	if(javaCheckbox.checked) extractClass(tempFileList, tempFolderList, entryList);
	if(pythonCheckbox.checked) extractFiles(tempFileList, tempFolderList, entryList);	
};
fileDragUpload.ondragover = function (e) {
	e.preventDefault();
};
folderDragUpload.ondrop = function (e) {
	e.preventDefault();
	tempFolderList = folderDrag(e.dataTransfer, tempFolderList, mapPath, listUl);
	if(javaCheckbox.checked) extractClass(tempFileList, tempFolderList, entryList);
	if(pythonCheckbox.checked) extractFiles(tempFileList, tempFolderList, entryList);
};
folderDragUpload.ondragover = function (e) {
	e.preventDefault();
};

javaCheckbox.addEventListener('change', function (event) {
	if (event.target.checked) {
		extractClass(tempFileList, tempFolderList, entryList);
		fileUploadBtn.addEventListener('change', function(){
			extractClass(tempFileList, tempFolderList, entryList);
			console.log("tempFileList", tempFileList);
			console.log("tempFolderList", tempFolderList);

		});
		folderUploadBtn.addEventListener('change', function(){
			extractClass(tempFileList, tempFolderList, entryList);
		});
	} else {
		fileUploadBtn.removeEventListener('change', extractClass);
		folderUploadBtn.removeEventListener('change', extractClass);
	}
});
pythonCheckbox.addEventListener('change', function (event) {
	if (event.target.checked) {
		extractFiles(tempFileList, tempFolderList, entryList);
		fileUploadBtn.addEventListener('change', function(){
			extractFiles(tempFileList, tempFolderList, entryList);
		});
		folderUploadBtn.addEventListener('change', function(){
			extractFiles(tempFileList, tempFolderList, entryList);
		});
	} else {
		fileUploadBtn.removeEventListener('change', extractFiles);
		folderUploadBtn.removeEventListener('change', extractFiles);
	}
});


