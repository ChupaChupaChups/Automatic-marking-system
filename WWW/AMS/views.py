from django.shortcuts import render
from django.contrib.auth import authenticate, login, forms
# Create your views here.

def post_list(request):
	return render(request, 'blog/post_list.html', {})

def index(request):
    user = request.user
    if user.is_staff:
        return render(request, 'blog/professor.html', {})
    else:
	    return render(request, 'blog/student.html', {})


