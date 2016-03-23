from django.shortcuts import render
from django.contrib.auth import authenticate, login, forms
# Create your views here.

def post_list(request):
	return render(request, 'blog/post_list.html', {})

def index(request):
	checkuser = request.user
	username = request.username;
	password = request.password;
	user = auth.authenticate(username=username, password=password)
	if user is not None:
		if user.is_active:
			auth.login(request, user)
			if checkuser.is_staff:
				return render(request, 'AMS/professor.html', {})
			else:
				return render(request, 'AMS/student.html', {})


