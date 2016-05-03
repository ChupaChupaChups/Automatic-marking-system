var reader = new FileReader();

reader.onload = function (event) {
	var contents = event.target.result;
	var regex = /class\s+([^\W]+)/g;
	var x = document.getElementById("mySelect");
	var matches;

	while (matches = regex.exec(contents)) {
//		console.log(matches);
		var option = document.createElement("option");
		option.text = matches[1];
		x.add(option);
	}

};

reader.onerror = function () {
	console.error("File could not be read!");
};

function readText() {
	var x = document.getElementById("mySelect");
	while (x.options.length) x.remove(0);

	reader.readAsText(document.getElementById('id_submit_file').files[0]);
}

document.getElementById('id_submit_file').addEventListener('change', readText, false);
