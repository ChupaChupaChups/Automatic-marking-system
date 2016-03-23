from django.shortcuts import render
from django.contrib.auth import authenticate, login, forms
# Create your views here.

def post_list(request):
	return render(request, 'blog/post_list.html', {})

def index(request):
    checkuser = request.user
    username = request.username;
    password = request.password;
    user = authenticate(username, password)
    if user is not None:
	 if user.is_active:
		login(request, user)
		if checkuser.is_staff:
			return render(request, 'blog/professor.html', {})
		else:
			return render(request, 'blog/student.html', {})


