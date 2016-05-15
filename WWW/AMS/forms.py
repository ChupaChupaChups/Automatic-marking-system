from datetimewidget.widgets import DateTimeWidget
from django import forms
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.safestring import mark_safe
from django_summernote.widgets import SummernoteInplaceWidget
from multiupload.fields import MultiFileField, MultiFileInput
from .models import Problem, SubmitRecord, SubmitFile


class HorizonRadioRenderer(forms.RadioSelect.renderer):
	def render(self):
		return mark_safe(u'\n'.join([u'{0}\n'.format(w) for w in self]))


class ProblemForm(forms.ModelForm):
	answercode = MultiFileField(
			min_num=1,
			max_file_size = 1024 * 1024 * 5,
			widget=MultiFileInput(attrs={
				'webkitdirectory' : True, 'directory' : True, 'multiple' : True,
			})
	)
	class Meta:
		model = Problem
		widgets = {
			'p_day_limit': DateTimeWidget(usel10n=True, bootstrap_version=3),
			'p_content': SummernoteInplaceWidget(),
			'p_input': SummernoteInplaceWidget(),
			'p_output': SummernoteInplaceWidget(),
		}
		fields = [
			'p_day_limit', 'p_submissions_count', 'p_c_ok', 'p_cpp_ok', 'p_java_ok', 'p_py_ok', 'p_hint_integer',
			'p_infile', 'p_outfile', 'p_judge', 'p_name', 'p_content', 'p_input', 'p_output',
		]
	def __init__(self, *args, **kwargs):
		super(ProblemForm, self).__init__(*args, **kwargs)
		self.fields['p_c_ok'].widget.attrs.update({'class' : 'switch-input'})
		self.fields['p_cpp_ok'].widget.attrs.update({'class' : 'switch-input'})
		self.fields['p_java_ok'].widget.attrs.update({'class' : 'switch-input'})
		self.fields['p_py_ok'].widget.attrs.update({'class' : 'switch-input'})
		self.fields['p_name'].widget.attrs.update({'class' : 'problem_name', 'value' : 'problemName', 'onFocus' : 'clearMessage(this)', 'onBlur' : 'clearMessage(this)'})
class SubmitForm(forms.ModelForm):
	attachments = MultiFileField(
			label='파일',
			min_num=1,
			max_file_size=1024 * 1024 * 5,
			widget=MultiFileInput(attrs={
				'webkitdirectory': True, 'directory': True, 'multiple': True,
			})
	)

	class Meta:
		model = SubmitRecord
		fields = ['language']
		widgets = {
			'language': forms.RadioSelect(renderer=HorizonRadioRenderer),
		}
		labels = {
			'language': '언어',
		}

	def __init__(self, user, problem_number, *args, **kwargs):
		kwargs.setdefault('label_suffix', '')
		self.problem_number = problem_number
		self.user = user
		super().__init__(*args, **kwargs)

	def save(self, commit=True):
		instance = super().save(commit=False)

		instance.submit_time = timezone.now()
		instance.user = User.objects.get(pk=self.user.pk)
		instance.problem = Problem.objects.get(pk=self.problem_number)

		instance.language = self.cleaned_data['language']

		if instance.language == 3 or instance.language == 4:
			instance.entry_point = self.data['entry_point']

		if commit:
			instance.save()

			for each in self.cleaned_data['attachments']:
				SubmitFile.objects.create(record=instance, file=each)

		return instance
