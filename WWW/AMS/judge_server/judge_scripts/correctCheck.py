import sys

#줄의 마지막 공백 무시
def ignore_last_whitespace(output, expected):
    for out, exp in output.split('\n'), expected.split('\n'):
        if out.rstrip() != exp.rstrip():
            print("예상결과 : " + exp.rstrip())
            print("제출결과 : " + out.rstrip())
            return False
    return True

def ignore_all(output, expected):
    for out, exp in output.split('\n'), expected.split('\n'):
        if out.replace(" ", "") != exp.replace(" ", ""):
            print("예상결과 : " + exp.rstrip())
            print("제출결과 : " + out.rstrip())
            return False
    return True

def correctCheck():
    with open(sys.argv[1], 'r') as exp:
        result_data = exp.read()
    with open(sys.argv[2], 'r') as out:
        output_data = out.read()
    #모든 공백 검사
    if sys.argv[3] == '0':
        ret = ignore_all(output_data, result_data)
    #마지막 공백 검사
    else:
        ret = ignore_last_whitespace(output_data, result_data)
    exp.close()
    out.close()
    if ret == False:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    correctCheck()