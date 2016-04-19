
var reader = new FileReader();

reader.onload = function(event) {
	var contents = event.target.result;
	var regex = /(class.+\w)/g;
	var class_name = contents.match(regex);
	var i = 0 ;
	var x = document.getElementById("mySelect");
	var option = [];
	for(i = 0; i <class_name.length;i++){
		console.log(class_name[i]);
		option[i] = document.createElement("option");
		console.log(option[i]);
		option[i].text = class_name[i];
		console.log(option[i].text);
		x.add(option[i]);
	}

};

reader.onerror = function(event) {
	console.error("File could not be read!");
};
function readText(event){
	reader.readAsText(document.getElementById('id_submit_file').files[0]);
}

document.getElementById('id_submit_file').addEventListener('change', readText, false);
