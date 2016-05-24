#!/usr/bin/env python3

import selectors
import subprocess

import psutil
from io import BytesIO

buffer = BytesIO()

proc = subprocess.Popen(
		['python3', '/compiler_and_judge/test3.py'],
		stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
		bufsize=0
)

process = psutil.Process(proc.pid)

selector = selectors.DefaultSelector()
# Register the selector to poll for "read" readiness on stdin
selector.register(proc.stdout, selectors.EVENT_READ)
while process.status() != psutil.STATUS_ZOMBIE:
	s = input() + '\n'
	proc.stdin.write(s.encode())
	proc.stdin.flush()

	while process.status() not in (psutil.STATUS_ZOMBIE, psutil.STATUS_SLEEPING):
		pass

	is_buffer_empty = True
	while is_buffer_empty:
		is_buffer_empty = False
		for event, mask in selector.select(0):
			byte = event.fileobj.read(1)
			if byte != b'':
				buffer.write(byte)
				is_buffer_empty = True
			else:
				is_buffer_empty = False

	print(buffer.getvalue().decode(), end='\u0000')
	buffer.truncate(0)
	buffer.seek(0)
