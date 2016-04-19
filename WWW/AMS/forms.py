from datetimewidget.widgets import DateTimeWidget
from django import forms
from django_summernote.widgets import SummernoteInplaceWidget

from .models import Problem, Submit_record


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
	class Meta:
		model = Submit_record
		fields = ['p_c_ok', 'p_cpp_ok', 'p_java_ok', 'p_py_ok', 'submit_file']
