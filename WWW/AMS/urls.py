from django.conf import settings
from django.conf.urls import url
from django.contrib.auth.views import login
from django.shortcuts import redirect
from django.views.generic import RedirectView
from . import views


def logout_required(view):
	def f(request, *args, **kwargs):
		if request.user.is_anonymous():
			return view(request, *args, **kwargs)
		return redirect(settings.LOGIN_REDIRECT_URL)

	return f


urlpatterns = [
	url(r'^$', RedirectView.as_view(url='/login')),
	url(r'^login', logout_required(login), name='login', kwargs={'template_name': 'login.html'}),
	url(r'^index', RedirectView.as_view(url='problem/list')),
	url(r'^logout', views.web_logout, name='logout'),
	url(r'^problem/list', views.problem_list, name='problem/list'),
	url(r'^problem/add', views.problem_add, name='problem/add'),
	url(r'^problem/(?P<problem_number>[0-9]+)$', views.problem_read, name='problem'),
	url(r'^problem/update/(?P<problem_number>[0-9]+)$', views.problem_update, name='problem/update'),
	url(r'^submit/(?P<problem_number>[0-9]+)$', views.answer_submit, name='submit')
]
