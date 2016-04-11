from django.conf.urls import url

from . import views

urlpatterns = [
	# url(r'^$', views.post_list, name='post_list'),
	url(r'^index', views.index, name='index'),
	url(r'^logout/$', views.web_logout, name='web_logout'),
	url(r'^problem_read/', views.problem_read, name='problem_read'),
	url(r'^problem_add/', views.problem_add, name='problem_add'),
	url(r'^problem_list/', views.problem_list, name='problem_list'),

]
