function labelclick(){
	console.log("a");
	$(this).parent().find('input').click();
}

function UploadFolder(folderUploadBtn, FolderList, listUl){
	var data = folderUploadBtn.files;
	var filelen, j = 0;
	if (FolderList != null) {
		for (filelen = 0; FolderList[filelen]; filelen++);
		for (var i = filelen; i < filelen + data.length; i++, j++) {
			FolderList[i] = data[j];
			if (mapPath[data[j].webkitRelativePath] == undefined) mapPath[data[j].webkitRelativePath] = [];
			mapPath[data[j].webkitRelativePath].push(data[j].webkitRelativePath);
		}
	}
	else {
		FolderList = data;
	}
	for (var i = 0; i < data.length; i++) {
		var tpl = $('<li class="working"><p></p><span></span></li>');
		tpl.find('p').text(data[i].webkitRelativePath).append('<i>' + '</i>');
		tpl.appendTo(listUl);
	}
	console.log(FolderList);

}
function UploadFiles(fileUploadBtn, FileList, listUl){
	var data = fileUploadBtn.files;
	var filelen, j = 0;
	if (FileList != null) {
		for (filelen = 0; FileList[filelen]; filelen++);
		for (var i = filelen; i < filelen + data.length; i++) {
			FileList[i] = data[j++];
		}
	}
	else {
			FileList = data;
	}
	console.log(FileList);
	for (var i = 0; i < data.length; i++) {
		var tpl = $('<li class="working"><p></p><span></span></li>');
		tpl.find('p').text(data[i].name).append('<i>' + '</i>');
		tpl.appendTo(listUl);
	}
}
function DropFileList(e, FileList, javaCheckbox, pythonCheckbox, listUl){
	e.preventDefault();
	if (e.dataTransfer && e.dataTransfer.files.length != 0) {
		var data = e.dataTransfer.files;
		if (FileList != null) {
			var templen, j = 0;
			for (templen = 0; FileList[templen]; templen++);
			for (var i = templen; i < templen + data.length; i++) {
				FileList[i] = data[j++];
			}
		}
		else FileList = data;

		for (var i = 0; i < data.length; i++) {
			var tpl = $('<li class="working"><p></p></li>');
			tpl.find('p').text(data[i].name).append('<i>' + '</i>');
			tpl.appendTo(listUl);
		}
	}

	if (javaCheckbox.checked) extractClass();
	if (pythonCheckbox.checked) extractFiles();
}
function dropFolder(e, FolderList, listUl, javaCheckbox, pythonCheckbox){
	e.preventDefault();
	if (e.dataTransfer && e.dataTransfer.files.length != 0) {
		var items = e.dataTransfer.items;
		for (var i = 0; i < items.length; i++) {
			var item = items[i].webkitGetAsEntry();
			if (item) {
				traverseFileTree(item, FolderList, listUl);
			}
		}
	}

	if (javaCheckbox.checked) extractClass();
	if (pythonCheckbox.checked) extractFiles();
}
function traverseFileTree(item, FolderList, listUl, path) {
	var templen;
	path = path || "";
	if (item.isFile) {
		item.file(
			function (file) {
				for (templen = 0; FolderList[templen]; templen++);
				console.log(templen);
				FolderList[templen] = file;
				if (mapPath[file.name] == undefined) {
					mapPath[file.name] = [];
				}
				mapPath[file.name].push(path);
			}
		);
		console.log(FolderList);
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
