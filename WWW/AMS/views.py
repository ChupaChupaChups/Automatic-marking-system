import inspect
import json
import sys

import os
from django.conf import settings
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .forms import ProblemForm, SubmitForm
from .models import Problem, SubmitRecord

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, os.path.dirname(parent_dir))

from judge_server.configuration.config import Config
from judge_server import judgeServer


# Create your views here.

def web_logout(req):
	logout(req)
	return redirect('/')


@login_required
def problem_list(req):
	problems = Problem.objects.all()
	return render(req, 'AMS/problem_list.html', {'problems': problems})


@login_required
def problem_read(req, problem_number):
	if req.method == 'DELETE':
		problem_to_delete = Problem.objects.get(pk=problem_number)

		if problem_to_delete is not None:
			problem_to_delete.delete()
			return HttpResponse()
		return HttpResponseNotFound()

	else:
		problem = get_object_or_404(Problem, pk=problem_number)
		return render(req, 'AMS/Read.html', {'problem': problem, 'p_number': problem_number})


@login_required
def problem_update(req, problem_number):
	problem = Problem.objects.get(pk=problem_number)
	if req.method == 'POST':
		form = ProblemForm(req.POST, req.FILES, instance=problem)
		if form.is_valid():
			form.save()
			return redirect('/problem/list')
	else:
		form = ProblemForm(instance=problem)
	return render(req, 'AMS/problem_add.html', {'create_form': form})


@login_required
def problem_add(req):
	if req.method == 'POST':
		form = ProblemForm(req.POST, req.FILES)
		if form.is_valid():
			form.save()
			return redirect('/problem/list')
	else:
		form = ProblemForm()

	return render(req, 'AMS/problem_add.html', {'create_form': form})


@login_required
def answer_submit(req, problem_number):
	if req.method == 'POST':
		form = SubmitForm(req.user, problem_number, req.POST, req.FILES)
		if form.is_valid():
			instance = form.save()

			save_metadata(instance)

			# TODO: rename variable
			media_path = os.path.join(settings.MEDIA_ROOT, 'answer', str(instance.pk))
			inputfiles = os.path.dirname(instance.problem.p_infile.path)
			judgeServer.judge(instance, media_path, inputfiles)

			return redirect('/problem/list')
	else:
		form = SubmitForm(req.user, problem_number)

	return render(req, 'AMS/answer_submit.html', {'create_form': form, 'p_number': problem_number})


def save_metadata(instance):
	media_path = os.path.join(settings.MEDIA_ROOT, 'answer', str(instance.pk))
	json_path = os.path.join(media_path, Config["django"]["code_meta_file"])

	with open(json_path, "w") as file:
		json.dump(
				{
					'language': instance.language,
					'entry_point': instance.entry_point,
					'problem_number': instance.problem.pk
				},
				file, ensure_ascii=False)


@login_required
def submit_result(req, problem_number):
	SubmitRecord.objects.filter()
