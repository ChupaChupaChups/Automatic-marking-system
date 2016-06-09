/** recursive search in uploaded folder **/
function traverseFileTree(item, folderList, map, Ul, path) {
	var templen;
	path = path || "";
	if (item.isFile) {
		item.file(
			function (file) {
				folderList.push(file);
				if (map[file.name] == undefined) {
					map[file.name] = [];
				}
				map[file.name].push(path);
			}
		);
		//console.log(tempFolderList);
		var tpl = $('<li class="working"><p></p><span></span></li>');
		tpl.find('p').text(item.fullPath).append('<input type="checkbox" class="d_checkbox" name="delete">');
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

function fileDrag(dataTransfer, fileList, Ul){
	if (dataTransfer && dataTransfer.files.length != 0) {
		var data = dataTransfer.files;
		if (fileList != null) {
			for (var i = 0; i < data.length; i++) {
				fileList.push(data[i]);
			}
		}
		else fileList = data;
			for (var i = 0; i < data.length; i++) {
				var tpl = $('<li class="working"><p></p><span></span></li>');
				tpl.find('p').text(data[i].name).append('<input type="checkbox" class="d_checkbox" name="delete">');
				tpl.appendTo(Ul);
			}
	}
	//console.log("drag file:",fileList);
	//if (javaCheckbox.checked) extractClass();
	//if (pythonCheckbox.checked) extractFiles();
	return fileList;
}

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
//	if (javaCheckbox.checked) extractClass();
//	if (pythonCheckbox.checked) extractFiles();
	return folderList;
}


function fileUpBtn(fileBtn, fileList, Ul){
	var data = fileBtn.files;
	if(fileList != null){
		for (var i = 0; i < data.length; i++) {
			fileList.push(data[i])
		}
	}
	else {
		fileList = data;
	}
	for (var i=0; i < data.length; i++){
		var tpl = $('<li class="working"><p></p><span></span></li>');
		tpl.find('p').text(data[i].name).append('<input type="checkbox" class="d_checkbox" name="delete">');
		tpl.appendTo(Ul);
	}
	console.log("click file:", fileList);
	return fileList;
};

function folderUpBtn(folderBtn, folderList, map, Ul){
	var data = folderBtn.files;
	if(folderList != null){
		for (filelen = 0; folderList[filelen]; filelen++);
		for (var i = 0; i < data.length; i++) {
			folderList.push(data[i]);
			if (map[data[i].webkitRelativePath] == undefined) map[data[i].webkitRelativePath] = [];
			map[data[i].webkitRelativePath].push(data[i].webkitRelativePath);
		}
	}
	else {
		folderList = data;
	}
	for (var i=0; i < data.length; i++){
		var tpl = $('<li class="working"><p></p><span></span></li>');
		tpl.find('p').text(data[i].webkitRelativePath).append('<input type="checkbox" class="d_checkbox" name="delete">');
		tpl.appendTo(Ul);
	}
	return folderList;
	//console.log("click folder:", folderList);
};

function delete_ullist(){
	
}
