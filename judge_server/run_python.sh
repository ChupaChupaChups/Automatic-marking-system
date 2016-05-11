#!/usr/bin/env bash

# TODO: 최종적으론 makefile로 변경

# TODO: 테스트 파일 여러개 가능하도록 변경
# TODO: 테스트 파일 이름을 고정이 아니도록 변경
# TODO: entry point를 입력 받도록 변경
python3 /source_code/main.py < /inputfiles/input.txt >> /source_code/result.txt
