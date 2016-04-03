from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, forms, logout
from django.contrib.auth.decorators import login_required
# Create your views here.

@login_required
def index(request):
	checkuser = request.user
	if checkuser.is_staff:
		return render(request, 'AMS/professor_base.html', {})
	else:
		return render(request, 'AMS/student_base.html', {})
def web_logout(req):
	logout(req)
	return HttpResponseRedirect('/')

def problem_read(req):
	return render(req, 'AMS/Read.html', {})
