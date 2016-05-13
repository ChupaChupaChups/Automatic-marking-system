function clearMessage(field){
	if(field.defaultValue == field.value) field.value = "";
	else if(field.value == "") field.value = field.defaultValue;
}
