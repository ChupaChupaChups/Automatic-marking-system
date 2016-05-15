document.addEventListener("DOMContentLoaded", function () {
	var content = document.getElementById('p_content');
	content.style.display = 'none';

	document.getElementById('content').addEventListener('click', function (event) {
		if (event.target.checked) content.style.display = 'block';
		else content.style.display = 'none';
	});

	var inputex = document.getElementById('p_input_example');
	inputex.style.display = 'none';

	document.getElementById('inputexample').addEventListener('click', function (event) {
		if (event.target.checked) inputex.style.display = 'block';
		else inputex.style.display = 'none';
	});

	var outputex = document.getElementById('p_output_example');
	outputex.style.display = 'none';

	document.getElementById('outputexample').addEventListener('click', function (event) {
		if (event.target.checked) outputex.style.display = 'block';
		else outputex.style.display = 'none';
	});

});