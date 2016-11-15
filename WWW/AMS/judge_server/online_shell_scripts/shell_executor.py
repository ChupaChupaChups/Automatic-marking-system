#!/usr/bin/env python3

import selectors # I/O multiplexing
import shlex # shell syntax lexer
import subprocess # python으로 외부명령어를 사용할 때
import sys

import psutil
from io import BytesIO

# TODO: Error handling
# TODO: make sure that handles all exceptions and errors


buffer = BytesIO()

# TODO: dynamic target program
proc = subprocess.Popen( # Popen을 사용하여 local program, 명령어를 사용한다.
		shlex.split(sys.argv[1]), # command        ??sys.argv[0]은 뭘까
		stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
		bufsize=0
)

process = psutil.Process(proc.pid) # proc.pid를 가진 process할당

selector = selectors.DefaultSelector()
# Register the selector to poll for "read" readiness on stdin
selector.register(proc.stdout, selectors.EVENT_READ) # register(fileobj, events, data=None)
while process.status() not in (psutil.STATUS_ZOMBIE, psutil.STATUS_DEAD):
	while process.status() not in (psutil.STATUS_ZOMBIE, psutil.STATUS_DEAD, psutil.STATUS_SLEEPING):
		for event, mask in selector.select(0):
			byte = event.fileobj.read(1) # register한 fileobj를 읽어서
			if byte != b'':
				buffer.write(byte) # buffer 에 읽은 byte를 write

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

	if len(buffer.getvalue()) is not 0: # buffer에 내용이 있다면,
		print(buffer.getvalue().decode(), end='\u0003', flush=True) # '\u0003' is end of text
		buffer.truncate(0)
		buffer.seek(0)

	if process.status() in (psutil.STATUS_ZOMBIE, psutil.STATUS_DEAD):
		# end of program
		print('\u0004', end='', flush=True) #'\u0004' is end of transmission
		exit(0)

	# ``input()`` vs ``sys.stdin.readline()``
	# http://stackoverflow.com/questions/22623528/sys-stdin-readline-and-input-which-one-is-faster-when-reading-lines-of-inpu
	s = sys.stdin.readline()
	proc.stdin.write(s.encode())
	proc.stdin.flush()

	while process.status() not in (psutil.STATUS_ZOMBIE, psutil.STATUS_DEAD, psutil.STATUS_SLEEPING):
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

	# ``end`` parameter force to print even if ``buffer.getvalue()`` is null string ('')
	print(buffer.getvalue().decode(), end='\u0003', flush=True)
	buffer.truncate(0)
	buffer.seek(0)

# end of program
print('\u0004', end='', flush=True)
