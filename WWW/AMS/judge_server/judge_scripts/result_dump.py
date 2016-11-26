import os, sys
import json


def result_dump(correct, time):
    if correct == "100":
        answer = 1;
    else:
        answer = 0;
    result_path = os.path.join("/json_file", "result.json")
    with open(result_path, "w") as file:
        json.dump(
            {
                'time': time,
                'answer': answer,
                'answer_percent': correct,
                'timeout': False,
            },
            file, ensure_ascii=False)

if __name__ == "__main__":
    result_dump(sys.argv[1], sys.argv[2])
