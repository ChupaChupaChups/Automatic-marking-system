import os
import os.path
import shutil
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from multiupload.fields import MultiFileField
# Create your models here.
from django.dispatch import receiver


class Problem(models.Model):
	upload_to_in = 'problem/{0}/testcase/{1}'
	upload_to_out = 'problem/{0}/testcase/{1}'

	def _get_upload_to_in(self, filename):
		return self.upload_to_in.format(self.p_name, filename)

	def _get_upload_to_out(self, filename):
		return self.upload_to_out.format(self.p_name, filename)

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

	p_day_limit = models.DateTimeField()
	p_submissions_count = models.IntegerField(default=0)
	p_c_ok = models.BooleanField()
	p_cpp_ok = models.BooleanField()
	p_java_ok = models.BooleanField()
	p_py_ok = models.BooleanField()
	p_hint_integer = models.IntegerField(default=100)
	p_infile = models.FileField(upload_to=_get_upload_to_in)
	p_outfile = models.FileField(upload_to=_get_upload_to_out)
	p_judge = models.BooleanField()
	p_name = models.CharField(max_length=100, unique=True)  # 문제 이름
	p_content = models.TextField(null=False)  # 문제 내용
	p_input = models.TextField(null=False)  # 입력 조건
	p_output = models.TextField(null=False)  # 출력 조건
	p_inputex = models.TextField(null=False)  # 입력 예제
	p_outputex = models.TextField(null=False)  # 출력 예제

	def __str__(self):
		return self.p_name


LANGUAGE_CHOICES = ((1, 'c'), (2, 'cpp'), (3, 'java'), (4, 'py'))


class SubmitRecord(models.Model):
	class Meta:
		unique_together = ('problem', 'user', 'submit_time')

	problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	submit_time = models.DateTimeField()
	language = models.IntegerField(choices=LANGUAGE_CHOICES, default = 1)  # 1 = c 2 = cpp 3 = java 4 = py
	entry_point = models.TextField(null=False, default='')
	def __str__(self):
		return str(self.problem)


class SubmitFile(models.Model):
	def save_path(self, filename):
		print(self.file_path)
		return 'answer/{0}/{1}'.format(self.record.pk, self.file_path)

	record = models.ForeignKey(SubmitRecord, on_delete=models.CASCADE)
	file = models.FileField(upload_to=save_path)
	file_path = models.TextField(null=True)


@receiver(models.signals.post_delete, sender=SubmitRecord)
def delete_file(sender, instance, *args, **kwargs):
	folder = os.path.join(settings.MEDIA_ROOT, 'answer', str(instance.pk))
	shutil.rmtree(folder)


class SubmitResult(models.Model):
	record = models.ForeignKey(SubmitRecord, on_delete=models.CASCADE)
	result = models.BooleanField()
	process_time = models.IntegerField()  # 소요 시간
	correct_percent = models.IntegerField()
