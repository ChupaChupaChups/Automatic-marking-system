from AMS.models import Problem
from django.forms import ModelForm


class ProblemForm(ModelForm):
	class Meta:
		model = Problem
		fields = ['p_day_limit', 'p_submissions_count', 'p_c_ok', 'p_cpp_ok', 'p_java_ok', 'p_py_ok', 'p_hint_integer',
				'p_infile', 'p_outfile', 'p_judge', 'p_name', 'p_content', 'p_input', 'p_output']
