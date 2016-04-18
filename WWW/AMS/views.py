from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .forms import ProblemForm, SubmitForm
from .models import Problem, Submit_record


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

	return render(req, 'AMS/Read.html', {'problem': problem})


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

def answer_submit(req):
        if req.method == 'POST':
                form = SubmitForm(req.POST, req.FILES)
                if form.is_valid():
                        form.save()
                        return redirect('/home/problem_list/')
        else:
                form = SubmitForm()

        return render(req, 'AMS/answer_submit.html', {'create_form': form})

