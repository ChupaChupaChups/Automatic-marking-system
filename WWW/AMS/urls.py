from django.conf.urls import url, include
from django.contrib.auth.views import login

from . import views

urlpatterns = [
	url(r'^login', login, name='login', kwargs={'template_name': 'login.html'}),
	url(r'^index', views.index, name='index'),
	url(r'^logout/$', views.web_logout, name='web_logout'),
	url(r'^problem_read/(?P<problem_number>[0-9]+)$', views.problem_read, name='problem_read'),
	url(r'^problem_add/', views.problem_add, name='problem_add'),
	url(r'^problem_list/', views.problem_list, name='problem_list'),
	url(r'^problem_delete/(?P<problem_number>[0-9]+)$', views.problem_delete, name='problem_delete'),
	url(r'^summernote/', include('django_summernote.urls'))
]
