import os
import os.path
import shutil
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver


class Problem(models.Model):
	upload_to_in = 'problem/{0}/testcase/{1}'
	upload_to_out = 'problem/{0}/testcase/{1}'
	upload_to_pdf = 'problem/{0}/{1}'

	def _get_upload_to_in(self, filename):
		return self.upload_to_in.format(self.p_name, filename)

	def _get_upload_to_out(self, filename):
		return self.upload_to_out.format(self.p_name, filename)

	def _get_upload_to_pdf(self, filename):
		return self.upload_to_pdf.format(self.p_name, filename)

	def delete(self, *args, **kwargs):
		ret = super(Problem, self).delete(*args, **kwargs)
		folder = os.path.join(settings.MEDIA_ROOT, 'problem', self.p_name)
		shutil.rmtree(folder)
		return ret

	def save(self, *args, **kwargs):
		try:
			this = Problem.objects.get(pk=self.pk)
			if this.p_infile != self.p_infile:
				this.p_infile.delete(save=True)
			if this.p_outfile != self.p_outfile:
				this.p_outfile.delete(save=True)
		except:
			pass
		super(Problem, self).save(*args, **kwargs)

	# Selected Language Option
	p_c_ok = models.BooleanField()
	p_cpp_ok = models.BooleanField()
	p_java_ok = models.BooleanField()
	p_py_ok = models.BooleanField()
	p_make_ok = models.BooleanField()

	# Problem options
	p_hint_integer = models.IntegerField(default=100)
	p_judge = models.BooleanField()
	p_submissions_count = models.IntegerField(default=0)
	p_day_limit = models.DateTimeField()

	# TODO remove and ADD forms.py MultipleFiles
	p_infile = models.FileField(upload_to=_get_upload_to_in)
	p_outfile = models.FileField(upload_to=_get_upload_to_out)

	# TODO no need?
	p_input = models.TextField(null=False)  # 입력 조건
	p_output = models.TextField(null=False)  # 출력 조건

	# Problem content
	p_content = models.TextField(null=True)  # 문제 내용
	p_pdffile = models.FileField(upload_to=_get_upload_to_pdf, null=True)
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
		return 'answer/{0}{1}{2}'.format(self.record.pk, self.path, filename)

	path = models.TextField()
	record = models.ForeignKey(SubmitRecord, on_delete=models.CASCADE)
	file = models.FileField(upload_to=_save_path)


@receiver(models.signals.post_delete, sender=SubmitRecord)
def delete_file(sender, instance, *args, **kwargs):
	folder = os.path.join(settings.MEDIA_ROOT, 'answer', str(instance.pk))
	shutil.rmtree(folder)


class SubmitResult(models.Model):
	record = models.ForeignKey(SubmitRecord, on_delete=models.CASCADE)
	result = models.BooleanField()
	process_time = models.IntegerField()  # 소요 시간
	correct_percent = models.IntegerField()
