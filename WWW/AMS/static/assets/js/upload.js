/** recursive search in uploaded folder **/
var tempList1 = [];
var tempList2 = [];
var fileindex = 0;
var folderindex = 0;
function traverseFileTree(item, folderList, map, Ul, path) {
	path = path || "";
	if (item.isFile) {
		item.file(
			function (file) {
				folderList.push(file);
				tempList2.push(file);
				if (map[file.name] == undefined) {
					map[file.name] = [];
				}
				map[file.name].push(path);
			}
		);
		//console.log(tempFolderList);
		var tpl = $('<li class="working"><p></p><span></span></li>');
		tpl.find('p').text(item.fullPath).append('<button class="btn btn-danger myleft" id="folder' + folderindex + '">delete');
		var a = tpl.find("#folder" + folderindex++);
		tpl.find('button').bind('click', function (e) {
			e.preventDefault();
			$(this).parent().parent().remove();
			var index = $(this).attr('id').replace(/[^0-9]/g, "");
			var removeindex = folderList.indexOf(tempList2[index]);
			folderList.splice(removeindex, 1);
			map[tempList2[index].webkitRelativePath] = [];
			console.log(folderList);
		});
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

function folderDrag(dataTransfer, folderList, map, Ul) {
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


function fileUpBtn(fileBtn, fileList, Ul) {
	var data = fileBtn.files;
	if (fileList != null) {
		for (i = 0; i < data.length; i++) {
			var isExistFile=false;
			for(var j=fileList.length-1;j>=0;j--) {
				if(data[i].name==fileList[j].name) { isExistFile=true; break;}
			}
			if(isExistFile==true) continue;
			tempList1.push(data[i]);
		}
	}
	else {
		fileList = data;
	}

	for (var i = fileList.length; i < tempList1.length; i++) {
		fileList.push(tempList1[i]);
		console.log(i,':pushing file is ',tempList1[i].name);
		var tpl = $('<li class="working"><p></p><span></span></li>');
		tpl.find('p').text(fileList[i].name).append('<button class="btn btn-danger myleft" id="file' + fileindex++ + '">delete');
		var a = tpl.find('button');
		a.bind('click', function (e) {
			e.preventDefault();
			$(this).parent().parent().remove();
			var index = $(this).attr('id').replace(/[^0-9]/g, "");
			var removeindex = fileList.indexOf(tempList1[index]);
			console.log('remove index : ',removeindex);
			fileList.splice(removeindex, 1);
			tempList1.splice(removeindex, 1);
			i--; fileindex--;
			console.log("after delete, click file:", fileList);
		});
		tpl.appendTo(Ul);
	}
	console.log('click file:',fileList);
	return fileList;
}

function folderUpBtn(folderBtn, folderList, map, Ul) {
	var data = folderBtn.files;
	var i;
	if (folderList != null) {
		for (i = 0; i < data.length; i++) {
			folderList.push(data[i]);
			tempList2.push(data[i]);
			if (map[data[i].webkitRelativePath] == undefined) map[data[i].webkitRelativePath] = [];
			map[data[i].webkitRelativePath].push(data[i].webkitRelativePath);
		}
	}
	else {
		folderList = data;
	}
	for (i = 0; i < data.length; i++) {
		var tpl = $('<li class="working"><p></p><span></span></li>');
		tpl.find('p').text(data[i].webkitRelativePath).append('<button class="btn btn-danger myleft" id="folder' + folderindex + '" >delete');
		var a = tpl.find("#folder" + folderindex++);
		a.bind('click', function (e) {
			e.preventDefault();
			$(this).parent().parent().remove();
			var index = $(this).attr('id').replace(/[^0-9]/g, "");
			var removeindex = folderList.indexOf(tempList2[index]);
			folderList.splice(removeindex, 1);
			map[tempList2[index].webkitRelativePath] = [];
			console.log('on folder delete', folderList);

		});
		tpl.appendTo(Ul);
	}
	console.log("click folder:", folderList);
	return folderList;

}

function delete_all(ul) {
	while (ul.children.length) ul.children.item(0).remove();
}
