var modal = document.getElementById('myModal');
var popBtn = document.getElementById("answerPop");
var close = document.getElementsByClassName("close")[0];
var submit = document.getElementById("submit");
var content = document.getElementById("contents");



popBtn.onclick = function() {
    modal.style.display = "block";
	//content.load("answer_submit.html");
}

close.onclick = function() {
    modal.style.display = "none";
}

submit.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


