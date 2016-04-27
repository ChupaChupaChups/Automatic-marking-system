import os
import shutil

from django.conf import settings
from django.db import models


# Create your models here.

class Problem(models.Model):
	upload_to_in = 'problem/{0}/testcase/{1}'
	upload_to_out = 'problem/{0}/testcase/{1}'

	def _get_upload_to_in(self, filename):
		return self.upload_to_in.format(self.p_name, filename)

	def _get_upload_to_out(self, filename):
		return self.upload_to_out.format(self.p_name, filename)

	def delete(self, using=None, keep_parents=False):
		# self.p_infile.delete()
		# self.p_outfile.delete()
		path = settings.MEDIA_ROOT
		folder = os.path.join(path, 'problem/' + str(self.p_name))
		shutil.rmtree(folder)
		return super().delete(using, keep_parents)

	def save(self, *args, **kwargs):
		try:
			this = Problem.objects.get(id=self.id)
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
	p_name = models.CharField(max_length=100)  # 문제 이름
	p_content = models.TextField(null=False)  # 문제 내용
	p_input = models.TextField(null=False)  # 입력 조건
	p_output = models.TextField(null=False)  # 출력 조건
	p_inputex = models.TextField(null=False, default="")  # 입력 예제
	p_outputex = models.TextField(null=False, default="")  # 출력 예제

	def __str__(self):
		return self.p_name


class Submit_record(models.Model):
	submit_to_in = 'problem/{0}/answer/{1}'

	def _get_submit_to_in(self, filename):
		return self.upload_to_in.format(self.p_name, filename)

	submit_p_name = models.CharField(max_length=100)
	submit_user_name = models.CharField(max_length=100)
	submit_time = models.DateTimeField()
	submit_result = models.BooleanField()
	submit_correct_percent = models.IntegerField()
	submit_language = models.IntegerField()  # 1 = c 2 = cpp 3 = java 4 = py
	submit_use_time = models.IntegerField()  # 소요 시간
	p_c_ok = models.BooleanField(default=False)
	p_cpp_ok = models.BooleanField(default=False)
	p_java_ok = models.BooleanField(default=False)
	p_py_ok = models.BooleanField(default=False)
	submit_file = models.FileField(upload_to=_get_submit_to_in, default="")
	submit_entry_pointer = models.TextField(null=False, default="")

	def __str__(self):
		return self.submit_p_name
