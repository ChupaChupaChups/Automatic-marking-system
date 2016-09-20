import os
import os.path
import shutil
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver


class Problem(models.Model):
    upload_to_pdf = 'problem/{0}/{1}'

    def _get_upload_to_pdf(self, filename):
        return self.upload_to_pdf.format(self.p_name, filename)

    # Selected Language Option
    p_c_ok = models.BooleanField()
    p_cpp_ok = models.BooleanField()
    p_java_ok = models.BooleanField()
    p_py_ok = models.BooleanField()
    p_make_ok = models.BooleanField()

    # Problem options
    p_hint_integer = models.IntegerField(default=100)
    p_day_limit = models.DateTimeField()

    # Problem content
    p_content = models.TextField(null=True, blank=True)  # 문제 내용
    p_pdffile = models.FileField(upload_to=_get_upload_to_pdf, null=True, blank=True)
    p_name = models.CharField(max_length=100, unique=True)  # 문제 이름

    def __str__(self):
        return self.p_name


LANGUAGE_CHOICES = ((1, 'c'), (2, 'cpp'), (3, 'java'), (4, 'py'), (5, 'makefile'),)


class SubmitRecord(models.Model):
    class Meta:
        unique_together = ('problem', 'user', 'submit_time')

    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    submit_time = models.DateTimeField()
    language = models.IntegerField(choices=LANGUAGE_CHOICES, default=1)  # 1 = c 2 = cpp 3 = java 4 = py
    entry_point = models.TextField(null=False, default='')

    def __str__(self):
        return str(self.problem)


class SubmitFile(models.Model):
    def _save_path(self, filename):
        return '{0}{1}'.format(self.path, filename)

    path = models.TextField()
    record = models.ForeignKey(SubmitRecord, on_delete=models.CASCADE)
    file = models.FileField(upload_to=_save_path)

@receiver(models.signals.post_delete, sender=SubmitRecord)
def delete_file(sender, instance, *args, **kwargs):
    folder = os.path.join(settings.MEDIA_ROOT, str(instance.problem.p_name))
    shutil.rmtree(folder)

class SubmitResult(models.Model):
    record = models.ForeignKey(SubmitRecord, on_delete=models.CASCADE)
    result = models.BooleanField()
    process_time = models.IntegerField()  # 소요 시간
    correct_percent = models.IntegerField()
