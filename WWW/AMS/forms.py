from datetimewidget.widgets import DateTimeWidget
from django import forms
from django.contrib.auth.models import User
from django.utils import timezone
from django_summernote.widgets import SummernoteInplaceWidget
from multiupload.fields import MultiFileField
from .models import Problem, SubmitRecord, SubmitFile


class ProblemForm(forms.ModelForm):
	class Meta:
		model = Problem
		widgets = {
			'p_day_limit': DateTimeWidget(usel10n=True, bootstrap_version=3),
			'p_content': SummernoteInplaceWidget(),
		}
		fields = ['p_day_limit', 'p_submissions_count', 'p_c_ok', 'p_cpp_ok', 'p_java_ok', 'p_py_ok', 'p_hint_integer',
				  'p_infile', 'p_outfile', 'p_judge', 'p_name', 'p_content', 'p_input', 'p_output', 'p_inputex',
				  'p_outputex']


class SubmitForm(forms.ModelForm):
	attachments = MultiFileField(min_num=1, max_file_size=1024 * 1024 * 5)

	class Meta:
		model = SubmitRecord
		fields = ['p_c_ok', 'p_cpp_ok', 'p_java_ok', 'p_py_ok']

	def __init__(self, user, problem_number, *args, **kwargs):
		self.problem_number = problem_number
		self.user = user
		super().__init__(*args, **kwargs)

	def save(self, commit=True):
		instance = super().save(commit=False)

		instance.entry_point = self.data['entry_point']

		instance.submit_time = timezone.now()
		instance.user = User.objects.get(pk=self.user.pk)
		instance.problem_num = Problem.objects.get(pk=self.problem_number)

		if self.cleaned_data['p_c_ok']:
			instance.language = 1
		elif self.cleaned_data['p_cpp_ok']:
			instance.language = 2
		elif self.cleaned_data['p_java_ok']:
			instance.language = 3
		elif self.cleaned_data['p_py_ok']:
			instance.language = 4

		if commit:
			instance.save()

			for each in self.cleaned_data['attachments']:
				SubmitFile.objects.create(record=instance, file=each)

		return instance
