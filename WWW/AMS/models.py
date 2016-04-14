from django.db import models


# Create your models here.

class Problem(models.Model):
	upload_to_in = 'problem/{0}/testcase/{1}'
	upload_to_out = 'problem/{0}/testcase/{1}'

	def _get_upload_to_in(self, filename):
		return self.upload_to_in.format(self.p_name, filename)

	def _get_upload_to_out(self, filename):
		return self.upload_to_out.format(self.p_name, filename)

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
	submit_p_name = models.CharField(max_length=100)
	submit_user_name = models.CharField(max_length=100)
	submit_time = models.DateTimeField()
	submit_result = models.BooleanField()
	submit_correct_percent = models.IntegerField()
	submit_language = models.IntegerField()  # 1 = c 2 = cpp 3 = java 4 = py
	submit_use_time = models.IntegerField()  # 소요 시간

	def __str__(self):
		return self.submit_p_name