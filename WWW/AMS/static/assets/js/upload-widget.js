/**
 * 각 업로드 위젯 마다 하나씩 가지며, 파일 목록 언어 선택등의 정보를 저장한다.
 * @constructor    업로드 위젯 데이터
 */
function UploadWidget() {
	this.fileUploadBtn = null;
	this.folderUploadBtn = null;
	this.deleteBtn = null;
	this.folderDrop = null;
	this.fileUL = null;

	this.cRadio = null;
	this.cppRadio = null;
	this.javaRadio = null;
	this.pyRadio = null;
	this.mkRadio = null;
	this.entryListDiv = null;
	this.entryList = null;

	this.fileList = [];
	this.folderList = [];
	this.mapPath = [];
}

UploadWidget.prototype.appendLanguage = function (formData) {
	var language;

	if (this.cRadio.checked) language = 1;
	else if (this.cppRadio.checked) language = 2;
	else if (this.javaRadio.checked) {
		formData.append("entrypoint", this.entryList.options[this.entryList.selectedIndex].value);
		language = 3;
	}
	else if (this.pyRadio.checked) {
		formData.append("entrypoint", this.entryList.options[this.entryList.selectedIndex].value);
		language = 4;
	}
	else language = 5;

	formData.append("language", language);
};

UploadWidget.prototype.appendFile = function (formData, prefix) {
	var i;
	for (i = 0; i < this.fileList.length; i++) {
		formData.append(prefix + "file", this.fileList[i]);
	}
	for (i = 0; i < this.folderList.length; i++) {
		formData.append(prefix + "folder", this.folderList[i]);

		if (this.folderList[i].webkitRelativePath == "") {
			formData.append(this.folderList[i].name, this.mapPath[this.folderList[i].name]);
		}
		else formData.append(this.folderList[i].webkitRelativePath, "");
	}
};