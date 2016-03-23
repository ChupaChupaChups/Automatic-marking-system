from django.shortcuts import render
from django.contrib.auth import authenticate, login, forms, logout
from django.contrib.auth.decorators import login_required
# Create your views here.

@login_required
def index(request):
	checkuser = request.user
	if checkuser.is_staff:
		return render(request, 'AMS/professor.html', {})
	else:
		return render(request, 'AMS/student.html', {})
def web_logout(request):
	logout(request)
	return render(request, 'AMS/student.html', {}) 

