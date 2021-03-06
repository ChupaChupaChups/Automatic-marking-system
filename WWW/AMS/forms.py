import os

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
            'p_content': TinyMCE(),
        }
        fields = [
            'p_day_limit', 'p_c_ok', 'p_cpp_ok', 'p_java_ok', 'p_py_ok', 'p_hint_integer',
            'p_name', 'p_content', 'p_pdffile', 'p_blank_accpet', 'p_flagContent', 'p_time_limit',
        ]


class SubmitForm(forms.ModelForm):
    attachments_file = MultiFileField(
        max_file_size=1024 * 1024 * 10,
        widget=MultiFileInput(),
        required=False
    )
    attachments_folder = MultiFileField(
        max_file_size=1024 * 1024 * 10,
        widget=MultiFileInput(),
        required=False
    )

    class Meta:
        model = SubmitRecord
        fields = ['language']
        widgets = {
            'language': forms.RadioSelect(renderer=HorizonRadioRenderer),
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
            print(self.files)
            instance.save()
            path = os.path.join(instance.problem.p_name, 'submit', str(instance.user), str(instance.pk), 'code/')
            if self.cleaned_data['attachments_file']:
                for each in self.cleaned_data['attachments_file']:
                    SubmitFile.objects.create(record=instance, file=each, path=path)
            if self.cleaned_data['attachments_folder']:
                for each in self.cleaned_data['attachments_folder']:
                    filepath = self.data[each.name]
                    print(filepath)
                    if filepath == "":
                        SubmitFile.objects.create(record=instance, file=each, path=path)
                    else:
                        SubmitFile.objects.create(record=instance, file=each, path=path + "/" + filepath)

        return instance
