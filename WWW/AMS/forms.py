from datetimewidget.widgets import DateTimeWidget
from django import forms
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.safestring import mark_safe
from multiupload.fields import MultiFileField, MultiFileInput
from tinymce.widgets import TinyMCE
from .models import Problem, SubmitRecord, SubmitFile


class HorizonRadioRenderer(forms.RadioSelect.renderer):
	def render(self):
		return mark_safe(u'\n'.join([u'{0}\n'.format(w) for w in self]))


class ProblemForm(forms.ModelForm):
	class Meta:
		model = Problem
		widgets = {
			'p_day_limit': DateTimeWidget(usel10n=True, bootstrap_version=3),
			'p_content': TinyMCE(attrs={'cols': 80, 'rows': 30}),
		}
		fields = [
			'p_day_limit', 'p_c_ok', 'p_cpp_ok', 'p_java_ok', 'p_py_ok', 'p_hint_integer',
			'p_name', 'p_content', 'p_pdffile', 'p_make_ok',
		]

	def __init__(self, *args, **kwargs):
		super(ProblemForm, self).__init__(*args, **kwargs)
		self.fields['p_c_ok'].widget.attrs.update({'class': 'switch-input'})
		self.fields['p_cpp_ok'].widget.attrs.update({'class': 'switch-input'})
		self.fields['p_java_ok'].widget.attrs.update({'class': 'switch-input'})
		self.fields['p_py_ok'].widget.attrs.update({'class': 'switch-input'})
		self.fields['p_make_ok'].widget.attrs.update({'class': 'switch-input'})
		self.fields['p_name'].widget.attrs.update({
			'class': 'form-control',
			'placeholder': 'Problem Name'
		})


class SubmitForm(forms.ModelForm):
	attachments_file = MultiFileField(
			max_file_size=1024 * 1024 * 10,
			widget=MultiFileInput(attrs={
				'multiple': True,
			})
	)
	attachments_folder = MultiFileField(
			max_file_size=1024 * 1024 * 10,
			widget=MultiFileInput(attrs={
				'multiple': True, 'webkitdirectory': True,
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
		self.problem = Problem.objects.get(pk=problem_number)
		self.user = user
		super().__init__(*args, **kwargs)

	def save(self, commit=True):
		instance = super().save(commit=False)
		instance.submit_time = timezone.now()
		instance.user = User.objects.get(pk=self.user.pk)
		instance.problem = self.problem
		instance.language = self.cleaned_data['language']
		if instance.language == 3 or instance.language == 4:
			instance.entry_point = self.data['entry_point']

		if commit:
			instance.save()
			if self.cleaned_data['attachments_file']:
				for each in self.cleaned_data['attachments_file']:
					SubmitFile.objects.create(record=instance, file=each, path="/")
			if self.cleaned_data['attachments_folder']:
				for each in self.cleaned_data['attachments_folder']:
					filepath = self.data[each.name]
					print(filepath)
					if filepath == "":
						SubmitFile.objects.create(record=instance, file=each, path="/")
					else:
						SubmitFile.objects.create(record=instance, file=each, path="/" + filepath + "/")

		return instance


class Test(forms.Form):
	content = forms.CharField(widget=TinyMCE(attrs={'cols': 80, 'rows': 30}))
