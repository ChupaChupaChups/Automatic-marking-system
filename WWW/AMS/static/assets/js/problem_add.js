/* all delete button */

var ic_delete = document.getElementById("ic_delete");
var ic_inputdelete = document.getElementById("ic_inputdelete");
var oc_delete = document.getElementById("oc_delete");
var io_inputdelete = document.getElementById("io_delete");
var io_outputdelete = document.getElementById("io_delete2");

/* code + input */
var codeUploadBtn = document.getElementById("ic_codefile");
var codeFolderUploadBtn = document.getElementById("ic_codefolder");
var infileUploadBtn = document.getElementById("ic_inputfile");
var infolderUploadBtn = document.getElementById("ic_inputfolder");

/* onlycode + shell */
var occodeUploadBtn = document.getElementById("oc_codefile");
var occodeFolderUploadBtn = document.getElementById("oc_codefolder");


/* input + output */
var ioinfileUploadBtn = document.getElementById("io_inputfile");
var ioinfolderUploadBtn = document.getElementById("io_inputfolder");
var outfileUploadBtn = document.getElementById("io_outputfile");
var outfolderUploadBtn = document.getElementById("io_outputfolder");

var codeFileList = [];
var codeFolderList = [];
var inFileList = [];
var inFolderList = [];
var outFileList = [];
var outFolderList = [];

var listUl = document.getElementById("listFile_ic");
var inlistUl = document.getElementById("inputlistFile_ic");
var outlistUl = document.getElementById("outputlistFile_io");
/* Drag upload Btn */

var folderDragUpload = document.getElementById("dropfolder_ic");
var infolderDragUpload = document.getElementById("inputfolder_ic");
var ofolderDragUpload = document.getElementById("dropfolder_oc");
var ioinfolderDragUpload = document.getElementById("inputfolder_io");
var outfolderDragUpload = document.getElementById("outputfolder_io");

/** language in input + code tab **/
var cCheckbox = document.getElementById('id_language_0');
var cppCheckbox = document.getElementById('id_language_1');
var javaCheckbox = document.getElementById('id_language_2');
var pythonCheckbox = document.getElementById('id_language_3');
var makefileCheckbox = document.getElementById("id_language_4");
var ic_entry_point = document.getElementById("ic_entry_point");

/* onlycode language */

var ocCheckbox = document.getElementById('id_language_00');
var ocppCheckbox = document.getElementById('id_language_11');
var ojavaCheckbox = document.getElementById('id_language_22');
var opythonCheckbox = document.getElementById('id_language_33');
var omakefileCheckbox = document.getElementById("id_language_44");
var oc_entry_point = document.getElementById("oc_entry_point");

var mapPath = [];
var inmapPath = [];
var outmapPath = [];
var tabNum = 1;

cCheckbox.checked = true;

var content = document.getElementById("p_content");
content.style.display = 'none';
function init() {
	codeFileList = [];
	codeFolderList = [];
	inFileList = [];
	inFolderList = [];
	outFileList = [];
	outFolderList = [];
};

document.getElementById('content').addEventListener('click', function (event) {
	if (event.target.checked) content.style.display = 'block';
	else content.style.display = 'none';
});

var answercode = document.getElementById('answer_code_upload');
answercode.style.display = 'none';

document.getElementById('answer_code').addEventListener('click', function (event) {
	if (event.target.checked) answercode.style.display = 'block';
	else answercode.style.display = 'none';
});

var inputfiles = document.getElementById('input_file_upload');
inputfiles.style.display = 'none';

document.getElementById('input_file').addEventListener('click', function (event) {
	if (event.target.checked) inputfiles.style.display = 'block';
	else inputfiles.style.display = 'none';
});

var inputfiles2 = document.getElementById('input_file_upload2');
inputfiles2.style.display = 'none';

document.getElementById('input_file2').addEventListener('click', function (event) {
	if (event.target.checked) inputfiles2.style.display = 'block';
	else inputfiles2.style.display = 'none';
});

var outputfiles = document.getElementById('output_file_upload');
outputfiles.style.display = 'none';

document.getElementById('output_file').addEventListener('click', function (event) {
	if (event.target.checked) outputfiles.style.display = 'block';
	else outputfiles.style.display = 'none';
});

document.getElementById('minus').addEventListener('click', function (event) {
	document.getElementById("hintBar").value -= 5;
	if (document.getElementById("hintBar").value == 0) document.getElementById("percent").innerHTML = "항상 힌트를 보여줍니다";
	else document.getElementById("percent").innerHTML = document.getElementById("hintBar").value + "% 이상 맞으면 힌트보여주기";
});
document.getElementById('plus').addEventListener('click', function (event) {
	document.getElementById("hintBar").value += 5;
	if (document.getElementById("hintBar").value == 100) document.getElementById("percent").innerHTML = "힌트를 보여주지 않습니다";
	else document.getElementById("percent").innerHTML = document.getElementById("hintBar").value + "% 이상 맞으면 힌트보여주기";
});

/** answer code, input example, output example upload **/
codeUploadBtn.addEventListener('change', function () {
	codeFileList = fileUpBtn(codeUploadBtn, codeFileList, listUl);
	console.log("click file:", codeFileList);
});
codeFolderUploadBtn.addEventListener('change', function () {
	codeFolderList = folderUpBtn(codeFolderUploadBtn, codeFolderList, mapPath, listUl);
	console.log("click folder:", codeFolderList);
});
infileUploadBtn.addEventListener('change', function () {
	inFileList = fileUpBtn(infileUploadBtn, inFileList, inlistUl);
	console.log("click infile:", inFileList);
});
infolderUploadBtn.addEventListener('change', function () {
	inFolderList = folderUpBtn(infolderUploadBtn, inFolderList, inmapPath, inlistUl);
	console.log("click infolder:", inFolderList);
});
occodeUploadBtn.addEventListener('change', function () {
	codeFileList = fileUpBtn(occodeUploadBtn, codeFileList, listUl);
	console.log("click onlycodefile : ", codeFileList);
});
occodeFolderUploadBtn.addEventListener('change', function () {
	codeFolderList = folderUpBtn(occodeFolderUploadBtn, codeFolderList, mapPath, listUl);
});
ioinfileUploadBtn.addEventListener('change', function () {
	inFileList = fileUpBtn(ioinfileUploadBtn, inFileList, inlistUl);
});
ioinfolderUploadBtn.addEventListener('change', function () {
	inFolderList = folderUpBtn(ioinfolderUploadBtn, inFolderList, inmapPath, inlistUl);
});
outfileUploadBtn.addEventListener('change', function () {
	outFileList = fileUpBtn(outfileUploadBtn, outFileList, outlistUl);
	console.log("click outfile:", outFileList);
});
outfolderUploadBtn.addEventListener('change', function () {
	outFolderList = folderUpBtn(outfolderUploadBtn, outFolderList, outmapPath, outlistUl);
	console.log("click outfolder:", outFolderList);
});

document.getElementById('in_co').addEventListener('click', function (event) {
	console.log("tab 1 clicked");
	tabNum = 1;
	mapPath = [], inmapPath = [], outmapPath = [];
	inlistUl = document.getElementById("inputlistFile_ic");
	listUl = document.getElementById("listFile_ic");
	while (ic_entry_point.options.length) ic_entry_point.remove(0);
	while (inlistUl.children.length) inlistUl.children.item(0).remove();
	while (listUl.children.length) listUl.children.item(0).remove();

	codeUploadBtn = document.getElementById("ic_codefile");
	codeFolderUploadBtn = document.getElementById("ic_codefolder");
	infileUploadBtn = document.getElementById("ic_inputfile");
	infolderUploadBtn = document.getElementById("ic_inputfolder");
	occodeUploadBtn.removeEventListener('change', extractClass);
	occodeFolderUploadBtn.removeEventListener('change', extractClass);
	occodeUploadBtn.removeEventListener('change', extractFiles);
	occodeFolderUploadBtn.removeEventListener('change', extractFiles);
	cCheckbox.checked = true;
	init();

});

document.getElementById('only_co').addEventListener('click', function (event) {
	console.log("tab 2 clicked");
	while (oc_entry_point.options.length) oc_entry_point.remove(0);
	codeUploadBtn = document.getElementById("oc_codefile");
	codeFolderUploadBtn = document.getElementById("oc_codefolder");
	mapPath = [], inmapPath = [], outmapPath = [];
	listUl = document.getElementById("listFile_oc");
	while (listUl.children.length) listUl.children.item(0).remove();
	tabNum = 2;
	codeUploadBtn.removeEventListener('change', extractClass);
	codeFolderUploadBtn.removeEventListener('change', extractClass);
	codeUploadBtn.removeEventListener('change', extractFiles);
	codeFolderUploadBtn.removeEventListener('change', extractFiles);
	ocCheckbox.checked = true;
	init();
});

document.getElementById('in_out').addEventListener('click', function (event) {
	console.log("tab 3 clicked");
	init();
	mapPath = [], inmapPath = [], outmapPath = [];
	inlistUl = document.getElementById("inputlistFile_io");
	outlistUl = document.getElementById("outputlistFile_io");

	while (inlistUl.children.length) inlistUl.children.item(0).remove();
	while (outlistUl.children.length) outlistUl.children.item(0).remove();

	infileUploadBtn = document.getElementById("io_inputfile");
	infolderUploadBtn = document.getElementById("io_inputfolder");
	outfileUploadBtn = document.getElementById("io_outputfile");
	outfolderUploadBtn = document.getElementById("io_outputfolder");
	codeUploadBtn.removeEventListener('change', extractClass);
	codeFolderUploadBtn.removeEventListener('change', extractClass);
	codeUploadBtn.removeEventListener('change', extractFiles);
	codeFolderUploadBtn.removeEventListener('change', extractFiles);
	occodeUploadBtn.removeEventListener('change', extractClass);
	occodeFolderUploadBtn.removeEventListener('change', extractClass);
	occodeUploadBtn.removeEventListener('change', extractFiles);
	occodeFolderUploadBtn.removeEventListener('change', extractFiles);

	tabNum = 3;

	init();
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

/** folder Drag Upload **/
folderDragUpload.ondragover = function (e) {
	e.preventDefault();
};
infolderDragUpload.ondragover = function (e) {
	e.preventDefault();
};
ofolderDragUpload.ondragover = function (e) {
	e.preventDefault();
};
ioinfolderDragUpload.ondragover = function (e) {
	e.preventDefault();
};
outfolderDragUpload.ondragover = function (e) {
	e.preventDefault();
};


folderDragUpload.ondrop = function (e) {
	e.preventDefault();
	codeFolderList = folderDrag(e.dataTransfer, codeFolderList, mapPath, listUl);
	console.log("drag folder:", codeFolderList);
};
infolderDragUpload.ondrop = function (e) {
	e.preventDefault();
	inFolderList = folderDrag(e.dataTransfer, inFolderList, inmapPath, inlistUl);
	console.log("drag infolder:", inFolderList);
};
ofolderDragUpload.ondrop = function (e) {
	e.preventDefault();
	codeFolderList = folderDrag(e.dataTransfer, codeFolderList, mapPath, listUl);
	console.log("drag ofolder:", codeFolderList);
};

ioinfolderDragUpload.ondrop = function (e) {
	e.preventDefault();
	inFolderList = folderDrag(e.dataTransfer, inFolderList, inmapPath, inlistUl);
	console.log("drag infolder:", inFolderList);
};
outfolderDragUpload.ondrop = function (e) {
	e.preventDefault();
	outFolderList = folderDrag(e.dataTransfer, outFolderList, outmapPath, outlistUl);
	console.log("drag outfolder:", outFolderList);
};

ic_delete.addEventListener('click', function () {
	codeFileList = [], codeFolderList = [], mapPath = [];
	delete_all(listUl);
});
ic_inputdelete.addEventListener('click', function () {
	inFileList = [], inFolderList = [], inmapPath = [];
	delete_all(inlistUl);
});
oc_delete.addEventListener('click', function () {
	codeFileList = [], codeFolderList = [], mapPath = [];
	delete_all(listUl);
});
io_inputdelete.addEventListener('click', function () {
	inFileList = [], inFolderList = [], inmapPath = [];
	delete_all(inlistUl);
});
io_outputdelete.addEventListener('click', function () {
	outFileList = [], outFolderList = [], outmapPath = [];
	delete_all(outlistUl);
});

javaCheckbox.addEventListener('change', function (event) {
	if (event.target.checked) {
		extractClass(codeFileList, codeFolderList, ic_entry_point);
		codeUploadBtn.addEventListener('change', function () {
			extractClass(codeFileList, codeFolderList, ic_entry_point);

		});
		codeFolderUploadBtn.addEventListener('change', function () {
			extractClass(codeFileList, codeFolderList, ic_entry_point);
		});
	} else {
		codeUploadBtn.removeEventListener('change', extractClass);
		codeFolderUploadBtn.removeEventListener('change', extractClass);
	}
});
pythonCheckbox.addEventListener('change', function (event) {
	if (event.target.checked) {
		extractFiles(codeFileList, codeFolderList, ic_entry_point);
		codeUploadBtn.addEventListener('change', function () {
			extractFiles(codeFileList, codeFolderList, ic_entry_point);
		});
		codeFolderUploadBtn.addEventListener('change', function () {
			extractFiles(codeFileList, codeFolderList, ic_entry_point);
		});
	} else {
		codeUploadBtn.removeEventListener('change', extractFiles);
		codeFolderUploadBtn.removeEventListener('change', extractFiles);
	}
});

ojavaCheckbox.addEventListener('change', function (event) {
	if (event.target.checked) {
		extractClass(codeFileList, codeFolderList, oc_entry_point);
		occodeUploadBtn.addEventListener('change', function () {
			extractClass(codeFileList, codeFolderList, oc_entry_point);

		});
		occodeFolderUploadBtn.addEventListener('change', function () {
			extractClass(codeFileList, codeFolderList, oc_entry_point);
		});
	} else {
		occodeUploadBtn.removeEventListener('change', extractClass);
		occodeFolderUploadBtn.removeEventListener('change', extractClass);
		occodeUploadBtn.removeEventListener('change', extractFiles);
		occodeFolderUploadBtn.removeEventListener('change', extractFiles);
	}
});
opythonCheckbox.addEventListener('change', function (event) {
	if (event.target.checked) {
		extractFiles(codeFileList, codeFolderList, oc_entry_point);
		occodeUploadBtn.addEventListener('change', function () {
			extractFiles(codeFileList, codeFolderList, oc_entry_point);
		});
		occodeFolderUploadBtn.addEventListener('change', function () {
			extractFiles(codeFileList, codeFolderList, oc_entry_point);
		});
	} else {
		occodeUploadBtn.removeEventListener('change', extractFiles);
		occodeFolderUploadBtn.removeEventListener('change', extractFiles);
	}
});

var Upload_files = document.getElementById("Upload_files");
Upload_files.addEventListener('click', function (event) {
	var formdata_temp = new FormData();
	var xhr = makeHttpObject();

	formdata_temp.append("tabnum", tabNum);

	switch (tabNum) {
		case 1:
			tab1(formdata_temp);
			break;
		case 2:
			tab2(formdata_temp);
			break;
		case 3:
			tab3(formdata_temp);
			break;
	}

	xhr.open("POST", "/problem/files");
	xhr.setRequestHeader("X-CSRFToken", csrf_token[1]);
	xhr.send(formdata_temp);
});

function tab1(formdata_temp) {
	ic_append_language(formdata_temp);
	append_code(formdata_temp);
	append_input(formdata_temp);
}

function tab2(formdata_temp) {
	oc_append_language(formdata_temp);
	append_code(formdata_temp);
}

function tab3(formdata_temp) {
	append_input(formdata_temp);
	append_output(formdata_temp);
}

function ic_append_language(formdata_temp) {
	var language;

	if (cCheckbox.checked) language = 1;
	else if (cppCheckbox.checked) language = 2;
	else if (javaCheckbox.checked) {
		formdata_temp.append("entrypoint", ic_entry_point.options[ic_entry_point.selectedIndex].value);
		language = 3;
	}
	else if (pythonCheckbox.checked) {
		formdata_temp.append("entrypoint", ic_entry_point.options[ic_entry_point.selectedIndex].value);
		language = 4;
	}
	else language = 5;

	formdata_temp.append("language", language);
}


function oc_append_language(formdata_temp) {
	var language;

	if (ocCheckbox.checked) language = 1;
	else if (ocppCheckbox.checked) language = 2;
	else if (ojavaCheckbox.checked) {
		formdata_temp.append("entrypoint", oc_entry_point.options[oc_entry_point.selectedIndex].value);
		language = 3;
	}
	else if (opythonCheckbox.checked) {
		formdata_temp.append("entrypoint", oc_entry_point.options[oc_entry_point.selectedIndex].value);
		language = 4;
	}
	else language = 5;

	formdata_temp.append("language", language);
}

function append_input(formdata_temp) {
	var i;
	for (i = 0; i < inFileList.length; i++) {
		formdata_temp.append("inputfile", inFileList[i]);
	}
	for (i = 0; i < inFolderList.length; i++) {
		formdata_temp.append("inputfolder", inFolderList[i]);
		if (inFolderList[i].webkitRelativePath == "") {
			formdata_temp.append(inFolderList[i].name, inmapPath[inFolderList[i].name]);
		}
		else formdata_temp.append(inFolderList[i].webkitRelativePath, "");
	}
}
function append_code(formdata_temp) {
	var i;
	for (i = 0; i < codeFileList.length; i++) {
		formdata_temp.append("codefile", codeFileList[i]);
	}
	for (i = 0; i < codeFolderList.length; i++) {
		formdata_temp.append("codefolder", codeFolderList[i]);
		if (codeFolderList[i].webkitRelativePath == "") {
			formdata_temp.append(codeFolderList[i].name, mapPath[codeFolderList[i].name]);
		}
		else formdata_temp.append(codeFolderList[i].webkitRelativePath, "");
	}
}
function append_output(formdata_temp) {
	var i;
	for (i = 0; i < outFileList.length; i++) {
		formdata_temp.append("outputfile", outFileList[i]);
	}
	for (i = 0; i < outFolderList.length; i++) {
		formdata_temp.append("outputfolder", outFolderList[i]);
		if (outFolderList[i].webkitRelativePath == "") {
			formdata_temp.append(outFolderList[i].name, outmapPath[outFolderList[i].name]);
		}
		else formdata_temp.append(outFolderList[i].webkitRelativePath, "");
	}
}
