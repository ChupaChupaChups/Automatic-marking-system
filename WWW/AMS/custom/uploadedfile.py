# -*- coding: utf-8 -*-
import os
from django.core.files.uploadedfile import UploadedFile

__all__ = ['FullPathInMemoryUploadedFile']
__author__ = 'isac322'


class FullPathInMemoryUploadedFile(UploadedFile):
	"""
	A file uploaded into memory (i.e. stream-to-memory).
	"""

	def __init__(self, file, field_name, name, content_type, size, charset, content_type_extra=None):
		super(FullPathInMemoryUploadedFile, self).__init__(file, name, content_type, size, charset, content_type_extra)
		self.field_name = field_name

	def open(self, mode=None):
		self.file.seek(0)

	def chunks(self, chunk_size=None):
		self.file.seek(0)
		yield self.read()

	def multiple_chunks(self, chunk_size=None):
		# Since it's in memory, we'll never have multiple chunks.
		return False

	def _get_name(self):
		return self._name

	def _set_name(self, name):
		# Sanitize the file name so that it can't be dangerous.
		if name is not None:
			# File names longer than 255 characters can cause problems on older OSes.
			if len(name) > 255:
				name, ext = os.path.splitext(name)
				ext = ext[:255]
				name = name[:255 - len(ext)] + ext

		self._name = name

	name = property(_get_name, _set_name)
