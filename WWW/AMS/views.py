import json

import os
import shutil

from django.conf import settings
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotFound, HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from . import onlineshellmanager
from .forms import ProblemForm, SubmitForm
from .judge_server.config import Config
from .models import Problem, SubmitRecord, SubmitResult
from .judge_server import judgeServer

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
    problem_to_delete = Problem.objects.get(pk=problem_number)
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
    return render(req, 'AMS/problem_add.html', {'form': form})


@login_required
def problem_add(req):
    if req.method == 'POST':
        print(req.FILES)
        form = ProblemForm(req.POST, req.FILES)
        if form.is_valid():
            form.save()
            #문제 추가하기 전에 테스트 입력 파일들을 임시로 저장한 것을 /media/'p_name' 폴더로 옮김
            fake_path = os.path.join(settings.MEDIA_ROOT, 'temp')
            real_path = os.path.join(settings.MEDIA_ROOT, req.POST['p_name'])
            if not os.path.exists(os.path.dirname(real_path)):
                os.makedirs(os.path.dirname(real_path))
            shutil.move(fake_path, real_path)
            print(req.POST['p_name'])
            return redirect('/problem/list')
    else:
        form = ProblemForm()

    return render(req, 'AMS/problem_add.html', {'form': form})


@login_required
def answer_submit(req, problem_number):
    problem = Problem.objects.get(pk=problem_number)
    #print(problem_number)
    #get_record = SubmitRecord.objects.filter(user=req.user, problem=problem)
    if req.method == 'POST':
        form = SubmitForm(req.user, problem_number, req.POST, req.FILES)
        print(form.errors)
        if form.is_valid():
            instance = form.save()
            save_metadata(instance)
            # TODO: rename variable
            # TODO: input, output path
            outputfiles = os.path.join(settings.MEDIA_ROOT, instance.problem.p_name, 'outputfile')
            media_path = os.path.join(settings.MEDIA_ROOT, instance.problem.p_name,
                                      'submit', str(req.user), str(instance.pk), 'code')
            inputfiles = os.path.join(settings.MEDIA_ROOT, instance.problem.p_name, 'inputfile')
            judgeServer.start_judge(media_path, inputfiles, outputfiles)

            # result store to database
            test_path = os.path.join(settings.MEDIA_ROOT,instance.problem.p_name,
                                     'submit',str(req.user),str(instance.pk),'result.json')
            f = open(test_path, 'r')
            result = json.load(f)
        #    with open(test_path,"r") as file:
        #        test = json.load(file) # after fix this, test_path will changed json_path
            get_result = SubmitResult(record=instance, result=result["answer"], process_time=result["time"], correct_percent=result["answer_percent"])
            get_result.save()
            return redirect('/problem/list')
    else:
        form = SubmitForm(req.user, problem_number)

    return render(req, 'AMS/answer_submit.html', {'form': form, 'p_number': problem_number, 'problem':problem})


@login_required
def submit_py_path(req):
    upload_files = req.FILES.getlist('attachments')
    file_names = [file.name for file in upload_files]
    response = JsonResponse({'file_name': file_names})
    return response


def save_metadata(instance):
    media_path = os.path.join(settings.MEDIA_ROOT, instance.problem.p_name, 'submit',
                              str(instance.user), str(instance.pk))
    json_path = os.path.join(media_path, Config["django"]["code_meta_file"])

    if not os.path.exists(os.path.dirname(json_path)):
        os.makedirs(os.path.dirname(json_path))
    with open(json_path, "w") as file:
        json.dump(
            {
                'language': instance.language,
                'entry_point': instance.entry_point,
                'problem_number': instance.problem.pk,
                'problem_name': instance.problem.p_name
            },
            file, ensure_ascii=False)


@login_required
def submit_result(req, problem_number):
    problem = Problem.objects.get(pk=problem_number)
    get_record = SubmitRecord.objects.filter(user=req.user, problem=problem)
    get_result = SubmitResult.objects.filter(record=get_record)

    return render(
        req,
        'AMS/submit_result.html',
        {'problem': problem, 'p_number': problem_number, 'record': get_record, 'result': get_result}
    )

@login_required
def test(req):
    return render(req, 'component/source_upload_widget.html', {'id': 'ic'})


def problem_files(req):
    media_path = os.path.join(settings.MEDIA_ROOT, 'temp')
    codefile_path = os.path.join(media_path, 'answercode')
    inputfile_path = os.path.join(media_path, 'inputfile')
    outputfile_path = os.path.join(media_path, 'outputfile')
    web_tab_number = req.POST['tabnum']
    files = req.FILES
    print(files)
    print(web_tab_number)

    if web_tab_number == "1":
        language = int(req.POST.get('language'))
        entry_point = ''
        if language in (3, 4):
            entry_point = req.POST.get('entrypoint')
        codefile = req.FILES.getlist('codefile')
        print(codefile)
        handle_upload_file(req, codefile, codefile_path, 1)
        codefolder = req.FILES.getlist('codefolder')
        print(codefolder)
        handle_upload_file(req, codefolder, codefile_path, 2)
        inputfile = req.FILES.getlist('inputfile')
        print(inputfile)
        handle_upload_file(req, inputfile, inputfile_path, 1)
        inputfolder = req.FILES.getlist('inputfolder')
        handle_upload_file(req, inputfolder, inputfile_path, 2)
    elif web_tab_number == "2":
        language = int(req.POST.get('language'))
        entry_point = ''
        if language in (3, 4):
            entry_point = req.POST.get('entrypoint')
        codefile = req.FILES.getlist('codefile')
        handle_upload_file(req, codefile, codefile_path, 1)
        codefolder = req.FILES.getlist('codefolder')
        handle_upload_file(req, codefolder, codefile_path, 2)

        json_path = os.path.join(codefile_path, Config["django"]["code_meta_file"])
        print("program files json path : " + json_path)
        with open(json_path, "w") as file:
            json.dump(
                {
                    'language': language,
                    'entry_point': entry_point
                },
                file, ensure_ascii=False)

        response = HttpResponse()
        response['X-ShellSession'] = onlineshellmanager.build_session()
        return response

    else:
        inputfile = req.FILES.getlist('inputfile')
        inputfolder = req.FILES.getlist('inputfolder')
        outputfile = req.FILES.getlist('outputfile')
        outputfolder = req.FILES.getlist('outputfolder')
        handle_upload_file(req, inputfile, inputfile_path, 1)
        handle_upload_file(req, inputfolder, inputfile_path, 2)
        handle_upload_file(req, outputfile, outputfile_path, 1)
        handle_upload_file(req, outputfolder, outputfile_path, 2)

    return HttpResponse()


def handle_upload_file(req, files, path, check):
    print(files)
    media_path = os.path.join(settings.MEDIA_ROOT, 'temp')
    for each in files:
        file_name = each
        print(file_name)
        if check == 1:
            filePath = os.path.join(path, str(file_name))
        else:
            tempfilePath = str(req.POST[str(file_name)])
            if tempfilePath == "":
                filePath = os.path.join(path, str(file_name))
            else:
                filePath = os.path.join(path, str(req.POST[str(file_name)]), str(file_name))
            print(filePath)
        if not os.path.exists(os.path.dirname(filePath)):
            os.makedirs(os.path.dirname(filePath))
        with open(filePath, 'wb+') as destination:
            destination.write(each.read())
