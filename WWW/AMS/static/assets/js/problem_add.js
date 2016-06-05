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

var codeFileList = codeUploadBtn.files;
var codeFolderList = codeFolderUploadBtn.files;
var inFileList = infileUploadBtn.files;
var inFolderList = infolderUploadBtn.files;
var outFileList = outfileUploadBtn.files;
var outFolderList = outfolderUploadBtn.files;

var listUl = document.getElementById("listFile_ic");
var inlistUl = document.getElementById("inputlistFile_ic");
var outlistUl = document.getElementById("outputlistFile_io");
/* Drag upload Btn */

var fileDragUpload = document.getElementById("dropfile_ic");
var folderDragUpload = document.getElementById("dropfolder_ic");
var infileDragUpload = document.getElementById("inputfile_ic");
var infolderDragUpload = document.getElementById("inputfolder_ic");

var ofileDragUpload = document.getElementById("dropfile_oc");
var ofolderDragUpload = document.getElementById("dropfolder_oc");

var ioinfileDragUpload = document.getElementById("inputfile_io");
var ioinfolderDragUpload = document.getElementById("inputfolder_io");
var outfileDragUpload = document.getElementById("outputfile_io");
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
codeUploadBtn.addEventListener('change', function(){
	codeFileList = fileUpBtn(codeUploadBtn, codeFileList, listUl);
	console.log("click file:", codeFileList);
});
codeFolderUploadBtn.addEventListener('change', function() {
	codeFolderList = folderUpBtn(codeFolderUploadBtn, codeFolderList, mapPath, listUl);
	console.log("click folder:", codeFolderList);
});
infileUploadBtn.addEventListener('change', function(){
	inFileList = fileUpBtn(infileUploadBtn, inFileList, inlistUl);
	console.log("click infile:", inFileList);
});
infolderUploadBtn.addEventListener('change', function() {
	inFolderList = folderUpBtn(infolderUploadBtn, inFolderList, inmapPath, inlistUl);
	console.log("click infolder:", inFolderList);
});
occodeUploadBtn.addEventListener('change', function(){
	codeFileList = fileUpBtn(occodeUploadBtn, codeFileList, listUl);
	console.log("click onlycodefile : ", codeFileList);
});
occodeFolderUploadBtn.addEventListener('change', function(){
	codeFolderList = folderUpBtn(occodeFolderUploadBtn, codeFolderList,mapPath, listUl);
});
ioinfileUploadBtn.addEventListener('change', function(){
	inFileList = fileUpBtn(ioinfileUploadBtn, inFileList, inlistUl);
});
ioinfolderUploadBtn.addEventListener('change', function(){
	inFolderList = folderUpBtn(ioinfolderUploadBtn, inFolderList, inmapPath, inlistUl);
});
outfileUploadBtn.addEventListener('change', function(){
	outFileList = fileUpBtn(outfileUploadBtn, outFileList, outlistUl);
	console.log("click outfile:", outFileList);
});
outfolderUploadBtn.addEventListener('change', function(){
	outFolderList = folderUpBtn(outfolderUploadBtn, outFolderList, outmapPath, outlistUl);
	console.log("click outfolder:", outFolderList);
});

document.getElementById('in_co').addEventListener('click',function(event){
	console.log("tab 1 clicked");
	codeFileList = null, codeFolderList = null, inFileList = null, inFolderList = null, outFileList = null, outFolderList = null;
	tabNum = 1;
	mapPath = [], inmapPath = [], outmapPath = [];
	inlistUl = document.getElementById("inputlistFile_ic");
	listUl = document.getElementById("listFile_ic");
	
	while(inlistUl.children.length) inlistUl.children.item(0).remove();
	while(listUl.children.length) listUl.children.item(0).remove();
		
	codeUploadBtn = document.getElementById("ic_codefile");
	codeFolderUploadBtn = document.getElementById("ic_codefolder");
	infileUploadBtn = document.getElementById("ic_inputfile");
	infolderUploadBtn = document.getElementById("ic_inputfolder");
	cCheckbox = document.getElementById('id_language_0');
	cppCheckbox = document.getElementById('id_language_1');
	javaCheckbox = document.getElementById('id_language_2');
	pythonCheckbox = document.getElementById('id_language_3');
	makefileCheckbox = document.getElementById("id_language_4");


});

document.getElementById('only_co').addEventListener('click',function(event){ 
	codeFileList = null, codeFolderList = null, inFileList = null, inFolderList = null, outFileList = null, outFolderList = null;
	console.log("tab 2 clicked");
	codeUploadBtn = document.getElementById("oc_codefile");
	codeFolderUploadBtn = document.getElementById("oc_codefolder");
	mapPath = [], inmapPath = [], outmapPath = [];
	listUl = document.getElementById("listFile_oc"); 
	while(listUl.children.length) listUl.children.item(0).remove();
	tabNum = 2;
});

document.getElementById('in_out').addEventListener('click',function(event){ 
	codeFileList = null, codeFolderList = null, inFileList = null, inFolderList = null, outFileList = null, outFolderList = null;
	console.log("tab 3 clicked");
	mapPath = [], inmapPath = [], outmapPath = [];
	inlistUl = document.getElementById("inputlistFile_io");
	outlistUl = document.getElementById("outputlistFile_io");

	while(inlistUl.children.length) inlistUl.children.item(0).remove();
	while(outlistUl.children.length) outlistUl.children.item(0).remove();

	infileUploadBtn = document.getElementById("io_inputfile");
	infolderUploadBtn = document.getElementById("io_inputfolder");
	outfileUploadBtn = document.getElementById("io_outputfile");
	outfolderUploadBtn = document.getElementById("io_outputfolder");

	tabNum = 3;		
		
	inmapPath = [], outmapPath = [];	
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


/** file Drag Upload **/

fileDragUpload.ondragover = function (e) {
	e.preventDefault();
};
infileDragUpload.ondragover = function (e) {
	e.preventDefault();
};
ofileDragUpload.ondragover = function (e){
	e.preventDefault();
};
ioinfileDragUpload.ondragover = function (e){
	e.preventDefault();
};
outfileDragUpload.ondragover = function (e) {
	e.preventDefault();
};


fileDragUpload.ondrop = function (e) {
	e.preventDefault();
	codeFileList = fileDrag(e.dataTransfer, codeFileList, listUl);
	console.log("drag file:",codeFileList);
};
infileDragUpload.ondrop = function (e) {
	e.preventDefault();
	inFileList = fileDrag(e.dataTransfer, inFileList, inlistUl);
	console.log("drag infile:",inFileList);
};
ofileDragUpload.ondrop = function (e) {
	e.preventDefault();
	codeFileList = fileDrag(e.dataTransfer, codeFileList, listUl);
	console.log("drag file:", codeFileList);
};

ioinfileDragUpload.ondrop = function (e) {
	e.preventDefault();
	inFileList = fileDrag(e.dataTransfer, inFileList, inlistUl);
};
outfileDragUpload.ondrop = function (e) {
	e.preventDefault();
	outFileList = fileDrag(e.dataTransfer, outFileList, outlistUl);
	console.log("drag outfile:",outFileList);
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

javaCheckbox.addEventListener('change', function (event) {
	if (event.target.checked) {
		extractClass(codeFileList, codeFolderList, ic_entry_point);
		codeUploadBtn.addEventListener('change', function(){
			extractClass(codeFileList, codeFolderList, ic_entry_point);

		});
		codeFolderUploadBtn.addEventListener('change', function(){
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
		codeUploadBtn.addEventListener('change', function(){
			extractFiles(codeFileList, codeFolderList, ic_entry_point);
		});
		codeFolderUploadBtn.addEventListener('change', function(){
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
		occodeUploadBtn.addEventListener('change', function(){
			extractClass(codeFileList, codeFolderList, oc_entry_point);

		});
		occodeFolderUploadBtn.addEventListener('change', function(){
			extractClass(codeFileList, codeFolderList, oc_entry_point);
		});
	} else {
		occodeUploadBtn.removeEventListener('change', extractClass);
		occodeFolderUploadBtn.removeEventListener('change', extractClass);
	}
});
opythonCheckbox.addEventListener('change', function (event) {
	if (event.target.checked) {
		extractFiles(codeFileList, codeFolderList, oc_entry_point);
		occodeUploadBtn.addEventListener('change', function(){
			extractFiles(codeFileList, codeFolderList, oc_entry_point);
		});
		occodeFolderUploadBtn.addEventListener('change', function(){
			extractFiles(codeFileList, codeFolderList, oc_entry_point);
		});
	} else {
		occodeUploadBtn.removeEventListener('change', extractFiles);
		occodeFolderUploadBtn.removeEventListener('change', extractFiles);
	}
});

