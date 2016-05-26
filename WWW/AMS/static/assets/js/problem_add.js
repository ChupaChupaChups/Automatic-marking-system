document.addEventListener("DOMContentLoaded", function () {
	/**
	 * File Upload Drag and Drop
	 */
	function makeHttpObject(){
		try{
			return new XMLHttpRequest();
		catch(error){
		}
		try{
			return new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(error){
		}
		try{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch(error){
		}
		throw new Error("Could not create HTTP request object.");
	}	
	$('#save_problem').click(function(e){
		e.preventDefault();
		var formdata = new FormData();
		var csrf_token = document.cookie.match(/csrftoken=([A-Za-z0-9]+);?/);
		var xhr = makeHttpObject();
		var c_ok = document.getElementById('id_p_c_ok').checked;
		var cpp_ok = document.getElementById('id_p_cpp_ok').checked;	
		var java_ok = document.getElementById('id_p_java_ok').checked;
		var py_ok = document.getElementById('id_p_py_ok').checked;
		formdata.append("csrfmiddlewaretoken", csrf_token[1]);
		formdata.append("c_ok", c_ok);
		formdata.append("cpp_ok", cpp_ok);
		formdata.append("java_ok", java_ok);
		formdata.append("py_ok", py_ok);
		
		
	});

	/**
	 * Visable Unvisable method
	 */
	var content = document.getElementById('p_content');
	content.style.display = 'none';

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

});
