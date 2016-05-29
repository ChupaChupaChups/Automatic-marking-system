#!/usr/bin/env python3

num = int(input())
for i in range(num):
	s = str(i) + '\t' + input() + '\n'
	t = ''
	l = len(s)
	for _ in range(1, l):
		t += s
	print(t, end='')
