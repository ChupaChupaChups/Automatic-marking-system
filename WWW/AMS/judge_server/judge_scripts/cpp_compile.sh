#!/usr/bin/env bash

# TODO: 최종적으론 makefile로 변경
arg_obj=$(find /source_code -iname "*.cpp")

g++ -o /compiler_and_judge/a.out ${arg_obj}

# TODO: 테스트 파일 여러개 가능하도록 변경
# TODO: 테스트 파일 이름을 고정이 아니도록 변경
(time /compiler_and_judge/a.out < /inputfiles/input.txt > /source_code/result.txt) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}'

