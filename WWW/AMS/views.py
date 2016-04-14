import re
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import ProblemForm
from .models import Problem


# Create your views here.

@login_required
def index(req):
	problems = Problem.objects.all()
	return render(req, 'AMS/problem_list.html', {'problems': problems})


def web_logout(req):
	logout(req)
	return HttpResponseRedirect('/')


@login_required
def problem_list(req):
	problems = Problem.objects.all()
	return render(req, 'AMS/problem_list.html', {'problems': problems})


@login_required
def problem_read(req):
	problem_number = re.sub(r'/home/problem_read/(\d)', r'\1', req.path)

	problem = Problem.objects.get(id=problem_number)

	return render(req, 'AMS/Read.html', {'problem': problem})

@login_required
def problem_update(req):
	problem_number = re.sub(r'/home/problem_update/(\d)',r'\1',req.path)
	problem = Problem.objects.get(id=problem_number)
	if req.method == 'POST':
		form = ProblemForm(req.POST, req.FILES, instance = problem)
		if form.is_valid():
			form.save()
			problems = Problem.objects.all()
			return render(req, 'AMS/problem_list.html',{'problems':problems})
	else:
		form = ProblemForm(instance = problem)
	return render(req,'AMS/problem_add.html',{'create_form':form})


@login_required
def problem_add(req):
	if req.method == 'POST':
		form = ProblemForm(req.POST, req.FILES)
		if form.is_valid():
			form.save()
			problems = Problem.objects.all()
			return render(req, 'AMS/problem_list.html', {'problems': problems})
	else:
		form = ProblemForm()

	return render(req, 'AMS/problem_add.html', {'create_form': form})
