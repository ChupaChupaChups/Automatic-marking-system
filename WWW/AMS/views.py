from django.shortcuts import render
from django.contrib.auth import authenticate, login, forms
# Create your views here.

def post_list(request):
	return render(request, 'blog/post_list.html', {})

def index(request):
	checkuser = request.user
	login(request)
	if checkuser.is_staff:
		return render(request, 'AMS/professor.html', {})
	else:
		return render(request, 'AMS/student.html', {})


