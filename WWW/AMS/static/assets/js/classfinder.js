var regex = /class\s+([^\W]+)/g;
var x = document.getElementById("id_entry_point");
var fileUploadBtn = document.getElementById("id_attachments");
function readText() {
	while (x.options.length) x.remove(0);
	var isJava = document.getElementById("id_p_java_ok").checked;
	console.log(fileUploadBtn.files);
	if(isJava){
		for (var i = 0; i < fileUploadBtn.files.length; i++) {
			var reader = new FileReader();
		
			reader.onload = function (event) {
				var contents = event.target.result;
				var matches;
	
				while (matches = regex.exec(contents)) {
//					console.log(matches);
					var option = document.createElement("option");
					option.text = matches[1];
					option.value = matches[1];
					x.add(option);
				}
	
			};
	
			reader.onerror = function () {
				console.error("File could not be read!");
			};
	
//			console.log(fileUploadBtn.files[i]);
			reader.readAsText(fileUploadBtn.files[i]);
		}
	}
	else{
		for (var i = 0; i < fileUploadBtn.files.length; i++){
			var option = document.createElement("option");
			option.text = fileUploadBtn.files.item(i).name;
			option.value = fileUploadBtn.files.item(i).name;
			x.add(option);
		}
	}
}
fileUploadBtn.addEventListener('change', readText, false);

