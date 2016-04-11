from ckeditor.widgets import CKEditorWidget
from bootstrap3_datetime.widgets import DateTimePicker

from django.forms import ModelForm
from django import forms

from .models import Problem


class ProblemForm(forms.ModelForm):
	p_content = forms.CharField(widget = CKEditorWidget())
	p_day_limit = forms.DateTimeField(
		required=True,
		widget=DateTimePicker(options="format": "YYYY-MM-DD HH:mm", "pickSeconds": False}))
	class Meta:
		model = Problem
		fields = ['p_day_limit', 'p_submissions_count', 'p_c_ok', 'p_cpp_ok', 'p_java_ok', 'p_py_ok', 'p_hint_integer',
				'p_infile', 'p_outfile', 'p_judge', 'p_name', 'p_content', 'p_input', 'p_output']
