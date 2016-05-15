function hidecontent(click){
	var content = document.getElementById('p_content');
	if(click.checked) content.style.display = 'block';
	else content.style.display = 'none'; 
}
function hideinputex(click){
	var inputex = document.getElementById('p_input_example');
	if(click.checked) inputex.style.display = 'block';
	else inputex.style.display = 'none';
}
function hideoutputex(click){
	var outputex = document.getElementById('p_output_example');
	if(click.checked) outputex.style.display = 'block';
	else outputex.style.display = 'none';
}
function clearMessage(field){
	if(field.defaultValue == field.value) field.value = "";
	else if(field.value == "") field.value = field.defaultValue;
}

