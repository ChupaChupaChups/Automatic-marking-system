from django.shortcuts import render
from django.contrib.auth import authenticate, login, form, logout
# Create your views here.

def index(request):
	checkuser = request.user
	if checkuser.is_staff:
		return render(request, 'AMS/professor.html', {})
	else:
		return render(request, 'AMS/student.html', {})
def logout(request):
	logout(request)
	return render(request, '/', {}) 

