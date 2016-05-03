from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect

from .forms import ProblemForm, SubmitForm
from .models import Problem

import os
from json import dumps, load
# Create your views here.

@login_required
def index(req):
	problems = Problem.objects.all()
	return render(req, 'AMS/problem_list.html', {'problems': problems})


def web_logout(req):
	logout(req)
	return redirect('/')


@login_required
def problem_list(req):
	problems = Problem.objects.all()
	return render(req, 'AMS/problem_list.html', {'problems': problems})


@login_required
def problem_read(req, problem_number):
	problem = get_object_or_404(Problem, id=problem_number)

	return render(req, 'AMS/Read.html', {'problem': problem, 'p_number': problem_number})


@login_required
def problem_update(req, problem_number):
	problem = Problem.objects.get(id=problem_number)
	if req.method == 'POST':
		form = ProblemForm(req.POST, req.FILES, instance=problem)
		if form.is_valid():
			form.save()
			return redirect('/home/problem_list/')
	else:
		form = ProblemForm(instance=problem)
	return render(req, 'AMS/problem_add.html', {'create_form': form})


@login_required
def problem_add(req):
	if req.method == 'POST':
		form = ProblemForm(req.POST, req.FILES)
		if form.is_valid():
			form.save()
			return redirect('/home/problem_list/')
	else:
		form = ProblemForm()

	return render(req, 'AMS/problem_add.html', {'create_form': form})


@login_required
def problem_delete(req, problem_number):
	if req.method == 'DELETE':
		problem_to_delete = Problem.objects.get(id=problem_number)

		if problem_to_delete is not None:
			problem_to_delete.delete()
			return HttpResponse()

	return HttpResponseNotFound()


@login_required
def answer_submit(req, problem_number):
	if req.method == 'POST':
		form = SubmitForm(req.POST, req.FILES)
		if form.is_valid():
			form.save()
			if form['p_c_ok'].data == 1:
				language = 'c'
			elif form['p_cpp_ok'].data == 1:
				language = 'cpp'
			elif form['p_java_ok'].data == 1:
				language = 'java'
			else:
				language = 'python'
			path = os.path.dirname(os.path.abspath(form['submit_file'].data))
			jsonpath = os.path.join(path, "config.json")
			with open(jsonpath, "w") as file:
				dumps({'language':language, 'metafile':form['startfilename'].data, file, indent=4)
			file.close()

			# TODO: judge submitted codes
			return redirect('/home/problem_list/')
	else:
		form = SubmitForm()

	return render(req, 'AMS/answer_submit.html', {'create_form': form, 'p_number': problem_number})
