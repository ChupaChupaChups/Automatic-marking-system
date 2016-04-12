from django_summernote.widgets import SummernoteWidget, SummernoteInplaceWidget
from datetimewidget.widgets import DateTimeWidget

from django.forms import ModelForm
from django import forms

from .models import Problem


class ProblemForm(forms.ModelForm):
	class Meta:
		model = Problem
		widgets = {
			'p_day_limit' : DateTimeWidget(usel10n=True, bootstrap_version=3),
			'p_content' : SummernoteInplaceWidget(),
		}
		fields = ['p_day_limit', 'p_submissions_count', 'p_c_ok', 'p_cpp_ok', 'p_java_ok', 'p_py_ok', 'p_hint_integer',
				'p_infile', 'p_outfile', 'p_judge', 'p_name', 'p_content', 'p_input', 'p_output']
