from django.db import models

# Create your models here.

class problem(models.Model):		
	p_condition =  models.Foreignkey('problem_condition')		# problem condition
	p_name = models.CharField(max_length=100)			# 문제 이름
	p_content = models.TextField(null=False)			# 문제 내용
	p_input = models.TextField(null=False)				# 입력 예제
	p_output = models.TextField(null=False)				# 출력 예제

class problem_condition(models.Model):
	day_limit = models.DateField()					# 제출기간 
	day_over = models.BooleanField()				# 제출기간을 초과 하였는지
	c_ok = models.BooleanField()					# C언어로 채점 가능 여부
	cpp_ok = models.BooleanField()					# C++언어로 채점 가능 여부
	java_ok = models.BooleanField()					# JAVA언어로 채점 가능 여부
	py_ok = models.BooleanField()					# python언어로 채점 가능 여부
	hint = models.BooleanField()					# 힌트 제공 여부
	hint_integer = models.IntegerField()			  	# 힌트 제공 시 얼마나 문제를 맞춰야 힌트가 제공 되는지 숫자값
	judge = models.BooleanField()					# True시 최적화 결과에 따라서 채점 False시 정답시 통과
	submissions_count = models.IntegerField(default=0)		# 학생이 시도한 횟수
	
