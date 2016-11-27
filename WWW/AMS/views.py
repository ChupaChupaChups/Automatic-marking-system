import json
import os
import shutil
from subprocess import call

from django.utils import timezone
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
from bs4 import BeautifulSoup


# Create your views here.

def web_logout(req):
    logout(req)
    return redirect('/')


@login_required
def problem_list(req):
    problems = Problem.objects.all()
    now = timezone.now()
    for problem in problems:
        if problem.p_day_limit < now:
            problem.p_day_not_over = False
        #    for e in problems:
        #        print(e.p_day_limit, e.p_content,e.p_c_ok)
    return render(req,
                  'AMS/problem_list.html',
                  {'problems': problems, 'user': req.user})


@login_required
def problem_read(req, problem_number):
    if req.method == 'DELETE':
        print("delete")
        problem_to_delete = Problem.objects.get(pk=problem_number)
        print(problem_to_delete)
        if problem_to_delete is not None:
            folder = os.path.join(settings.MEDIA_ROOT, str(problem_to_delete))
            problem_to_delete.delete()
            shutil.rmtree(folder)
            return HttpResponse()
        return HttpResponseNotFound()

    else:
        problem = get_object_or_404(Problem, pk=problem_number)

        return render(req, 'AMS/Read.html', {'problem': problem, 'p_number': problem_number, 'user': req.user})


@login_required
def problem_update(req, problem_number):
    problem = Problem.objects.get(pk=problem_number)

    if req.method == 'POST':
        # prev_folder_name = os.path.join(settings.MEDIA_ROOT, problem.p_name)
        # next_folder_name = os.path.join(settings.MEDIA_ROOT, req.POST['p_name'])
        form = ProblemForm(req.POST, req.FILES, instance=problem)
        if form.is_valid():
            # shutil.move(prev_folder_name, next_folder_name)
            form.save()
            return redirect('/problem/list')
    else:
        form = ProblemForm(instance=problem)
    return render(req, 'AMS/problem_add.html', {'form': form, 'update': 0, 'p_number': problem_number})


@login_required
def problem_add(req):
    if req.method == 'POST':
        print(req.FILES)
        form = ProblemForm(req.POST, req.FILES)
        if form.is_valid():
            form.save()
            save_flagContent(req.POST)
            return redirect('/problem/list')
    else:
        form = ProblemForm()
    return render(req, 'AMS/problem_add.html', {'form': form, 'update': 1, 'p_number': -1})


def save_flagContent(req):
    json_path = os.path.join(settings.MEDIA_ROOT, req['p_name'], 'flag.json')
    if not os.path.exists(os.path.dirname(json_path)):
        os.makedirs(os.path.dirname(json_path))
    with open(json_path, "w") as file:
        json.dump(
            {
                'flagContent': req['p_flagContent']
            },
            file, ensure_ascii=False)


@login_required
def answer_submit(req, problem_number):
    problem = Problem.objects.get(pk=problem_number)
    if req.method == 'POST':
        form = SubmitForm(req.user, problem_number, req.POST, req.FILES)
        print(form.errors)
        if form.is_valid():
            instance = form.save()
            save_metadata(instance)
            outputfiles = os.path.join(settings.MEDIA_ROOT, instance.problem.p_name, 'outputfile')
            media_path = os.path.join(settings.MEDIA_ROOT, instance.problem.p_name,
                                      'submit', str(req.user), str(instance.pk), 'code')
            inputfiles = os.path.join(settings.MEDIA_ROOT, instance.problem.p_name, 'inputfile')
            judgeServer.start_judge(media_path, inputfiles, outputfiles)

            # result store to database
            test_path = os.path.join(settings.MEDIA_ROOT, instance.problem.p_name,
                                     'submit', str(req.user), str(instance.pk), 'result.json')
            f = open(test_path, 'r')
            result = json.load(f)
            #    with open(test_path,"r") as file:
            #        test = json.load(file) # after fix this, test_path will changed json_path
            print(result["answer"])

            if result["answer"] == 0:
                ret = False
            else:
                ret = True
            print(ret)
            get_result = SubmitResult(record=instance, result=ret, process_time=result["time"],
                                      correct_percent=result["answer_percent"], timeout=result["timeout"])
            get_result.save()
            return redirect('/problem/list')
    else:
        form = SubmitForm(req.user, problem_number)

    return render(req, 'AMS/answer_submit.html', {'form': form, 'p_number': problem_number, 'problem': problem})


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
                'problem_name': instance.problem.p_name,
                'problem_blank': instance.problem.p_blank_accpet
            },
            file, ensure_ascii=False)


@login_required
def submit_result(req, problem_number):
    problem = Problem.objects.get(pk=problem_number)
    get_record = SubmitRecord.objects.filter(user=req.user, problem=problem)
    get_result = SubmitResult.objects.filter(record__in=get_record)
    return render(
        req,
        'AMS/submit_result.html',
        {'problem': problem, 'p_number': problem_number, 'record': get_record, 'result': get_result}
    )


@login_required
def all_result(req, problem_number):
    problem = Problem.objects.get(pk=problem_number)
    get_record = SubmitRecord.objects.filter(problem=problem)
    get_result = SubmitResult.objects.filter(record__in=get_record)
    return render(
        req,
        'AMS/allresult.html',
        {'problem': problem, 'p_number': problem_number, 'record': get_record, 'result': get_result}
    )


@login_required
def test(req):
    return render(req, 'component/source_upload_widget.html', {'id': 'ic'})


def problem_files(req):
    # print(req.POST['p_name'])
    print(req.POST.get('p_number'))
    media_path = os.path.join(settings.MEDIA_ROOT, req.POST['p_name'])
    if req.POST.get('p_number') is not None:
        print("1")
        problem = Problem.objects.get(pk=int(req.POST['p_number']))
        real_path = os.path.join(settings.MEDIA_ROOT, problem.p_name)
        shutil.move(real_path, media_path)
    print(media_path)
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
            entry_point = req.POST.get('entry_point')
        codefile = req.FILES.getlist('codefile')
        codefolder = req.FILES.getlist('codefolder')
        inputfile = req.FILES.getlist('inputfile')
        inputfolder = req.FILES.getlist('inputfolder')
        print(len(codefile))
        print(len(codefolder))
        if codefile or codefolder:
            if os.path.exists(codefile_path):
                print("delete")
                shutil.rmtree(codefile_path)
            if codefile:
                print(codefile)
                handle_upload_file(req, codefile, codefile_path, 1)
            if codefolder:
                print(codefolder)
                handle_upload_file(req, codefolder, codefile_path, 2)
        if inputfile:
            print(inputfile)
            handle_upload_file(req, inputfile, inputfile_path, 1)
        if inputfolder:
            handle_upload_file(req, inputfolder, inputfile_path, 2)

        outputCreatorPath = os.path.join(os.path.dirname(__file__), 'outfileCreator', 'outFile.sh')
        call([outputCreatorPath, str(language), codefile_path, inputfile_path, outputfile_path, entry_point])

    elif web_tab_number == "2":
        language = int(req.POST.get('language'))
        entry_point = ''
        if language in (3, 4):
            entry_point = req.POST.get('entry_point')
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
        if inputfile is not None:
            handle_upload_file(req, inputfile, inputfile_path, 1)
        if inputfolder is not None:
            handle_upload_file(req, inputfolder, inputfile_path, 2)
        if outputfile is not None:
            handle_upload_file(req, outputfile, outputfile_path, 1)
        if outputfolder is not None:
            handle_upload_file(req, outputfolder, outputfile_path, 2)

    return HttpResponse()


def handle_upload_file(req, files, path, check):
    print(files)
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


def errorlist(req, problem_number, rst_number):
    problemname = Problem.objects.get(pk=problem_number).p_name
    rstuser = SubmitResult.objects.get(pk=rst_number).record.user
    errorlistpath = os.path.join(settings.MEDIA_ROOT, problemname, 'submit', str(rstuser), rst_number, 'log.txt')
    with open(errorlistpath, 'r') as f:
        content = f.read()

    print(content)
    return render(req, 'AMS/errorlist.html', {'content': content})


def after_submit(req, problem_number):
    problem = Problem.objects.get(pk=problem_number)
    get_record = SubmitRecord.objects.filter(user=req.user, problem=problem)
    get_result = SubmitResult.objects.filter(record__in=get_record).latest('record')
    if get_result.result == False:
        errorlistpath = os.path.join(settings.MEDIA_ROOT, problem.p_name, 'submit', str(get_result.record.user),
                                     str(get_result.pk), 'log.txt')
        with open(errorlistpath, 'r') as f:
            content = f.read()
        return render(req, 'AMS/after_submit.html',
                      {'content': content, 'problem': problem, 'p_number': problem_number, 'record': get_record,
                       'result': get_result})
    return render(req, 'AMS/after_submit.html',
                  {'problem': problem, 'p_number': problem_number, 'record': get_record, 'result': get_result})
