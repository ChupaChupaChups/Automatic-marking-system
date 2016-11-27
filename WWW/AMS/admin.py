from django.contrib import admin
from .models import Problem, SubmitRecord, SubmitResult, SubmitTry

# Register your models here.

admin.site.register(Problem)
admin.site.register(SubmitRecord)
admin.site.register(SubmitResult)
admin.site.register(SubmitTry)