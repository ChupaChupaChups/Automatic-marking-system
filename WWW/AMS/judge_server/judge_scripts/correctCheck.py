import sys
import re
#-*- coding: utf-8 -*-

pattern = re.compile(r'\s+|\n+')

#줄의 마지막 공백 무시
def ignore_last_whitespace(submit, expected):
    for out, exp in zip(submit.split('\n'), expected.split('\n')):
        if out.rstrip() != exp.rstrip():
            if sys.argv[4] == '0':
                print("Expected Result : " + exp.rstrip())
                print("Submit Result : " + out.rstrip())
                return False
            else:
                return False
    return True
#줄의 모든 공백 무시
def ignore_all(submit, expected):
    global pattern
    outs = submit.split('\n')
    exps = expected.split('\n')
    while '' in outs: outs.remove('')
    while '' in exps: exps.remove('')
    for out, exp in zip(outs, exps):
        if re.sub(pattern, '', out) != re.sub(pattern, '', exp):
            if sys.argv[4] == '0':
                print("Expected Result : " + exp.rstrip())
                print("Submit Result : " + out.rstrip())
                return False
            else:
                return False
    return True

def correctCheck():
    with open(sys.argv[1], 'r') as exp:
        submit_data = exp.read()
    with open(sys.argv[2], 'r') as out:
        result_data = out.read()
    #모든 공백 검사
    if sys.argv[3] == '0':
        ret = ignore_all(submit_data, result_data)
    #마지막 공백 검사
    else:
        ret = ignore_last_whitespace(submit_data, result_data)
    exp.close()
    out.close()
    if ret == False:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    correctCheck()
