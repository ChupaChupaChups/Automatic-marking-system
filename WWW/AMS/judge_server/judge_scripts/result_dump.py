import os, sys
import json


def result_dump():
    if sys.argv[1] == "100":
        answer = 1;
    else:
        answer = 0;
    if sys.argv[3] == "0":
        timeout = True
    else:
        timeout = False
    result_path = os.path.join("/json_file", "result.json")
    with open(result_path, "w") as file:
        json.dump(
            {
                'time': sys.argv[2],
                'answer': answer,
                'answer_percent': sys.argv[1],
                'timeout': timeout,
            },
            file, ensure_ascii=False)

if __name__ == "__main__":
    result_dump()
