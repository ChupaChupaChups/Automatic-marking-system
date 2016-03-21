from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    # Examples:
    # url(r'^$', 'myblog.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^home/', include('blog.urls')),
    url(r'', 'django.contrib.auth.views.login',
	name='login',
	kwargs={
		'template_name': 'login.html'
	}
    ),
    url(r'^logout/',
	'django.contrib.auth.views.logout',
	name='logout'
    ),
]
