import sys

f1 = open(sys.argv[1], 'r')  # student_answer
f2 = open(sys.argv[2], 'r')  # correct_answer

same = True

while same:
	f1_line = f1.readline()
	f2_line = f2.readline()
	if not f1_line and not f2_line:
		break
	elif not f1_line:
		same = False
		break
	elif not f2_line:
		same = False
		break
	if f1_line != f2_line:
		same = False

if not same:
	print("incorrect Answer")
else:
	print("correct Answer")
