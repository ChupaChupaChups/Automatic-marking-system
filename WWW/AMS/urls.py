from django.conf.urls import url
from . import views

urlpatterns = [
	#url(r'^$', views.post_list, name='post_list'),
	url(r'^index', views.index, name='index'),
	url(r'^logout/$', views.web_logout, name='web_logout'),
	url(r'^problem_read/', views.read, name='problem_read'),
]
