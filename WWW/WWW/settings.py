"""
Django settings for WWW project.

Generated by 'django-admin startproject' using Django 1.9.4.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '2syg)%!jswup%t6$ihc%$a^vm96)7e8$oh*4uxntltlq39l&qt'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Application definition
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

INSTALLED_APPS = [
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	# for TextEditor
	'django_summernote',
	# for DateTimePicker
	'datetimewidget',
	# Project
	'AMS',
	# for WebSocket service
	'channels',
	# for TinyMCE web editor
	'tinymce',
	# for template tweak (https://github.com/kmike/django-widget-tweaks)
	'widget_tweaks'
]

MIDDLEWARE_CLASSES = [
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
	# for DateTimePicker
	'django.middleware.locale.LocaleMiddleware',

]

ROOT_URLCONF = 'WWW.urls'

# for channel module's setting
CHANNEL_LAYERS = {
	"default": {
		"BACKEND": "asgiref.inmemory.ChannelLayer",
		"ROUTING": "AMS.websocket_routing.channel_routing",
	},
}

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [
			os.path.join(BASE_DIR, 'templates'),
		],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
				'django.core.context_processors.request',
			],
		},
	},
]

WSGI_APPLICATION = 'WWW.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.sqlite3',
		'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
	}
}

# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	},
]

# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'statics')

LOGIN_URL = '/login/'
LOGOUT_URL = '/logout/'
LOGIN_REDIRECT_URL = '/index'

# for full file path
FILE_UPLOAD_HANDLERS = [
	'AMS.custom.uploadhandler.FullPathUploadHandler',
	'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]

# for TinyMCE editor
TINYMCE_JS_URL = os.path.join(os.path.join(BASE_DIR, STATIC_URL), 'tinymce', 'tinymce.min.js')
TINYMCE_JS_ROOT = os.path.join(os.path.join(BASE_DIR, STATIC_URL), 'tinymce')
TINYMCE_DEFAULT_CONFIG = {
	'theme': 'modern',
	'language': 'ko_KR',
	'plugins': [
		'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'hr', 'anchor', 'pagebreak',
		'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
		'media', 'nonbreaking', 'save', 'table', 'contextmenu', 'directionality', 'emoticons', 'template', 'paste',
		'textcolor', 'colorpicker', 'textpattern', 'imagetools'
	]
}
