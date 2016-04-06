from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, forms, logout
from django.contrib.auth.decorators import login_required
from .forms import ProblemForm
# Create your views here.

@login_required
def index(request):
		return render(request, 'AMS/header.html', {})
def web_logout(req):
	logout(req)
	return HttpResponseRedirect('/')

def problem_read(req):
	return render(req, 'AMS/Read.html', {})

def problem_add(req):
	if req.method == 'POST':
		form = ProblemForm(req.POST, req.FILES)
		if form.is_valid():
			form.save()
			return HttpResponseRedirect('/')
	else:
		form = ProblemForm()
	
	return render(req, 'AMS/problem_add.html', {'create_form': form, })
