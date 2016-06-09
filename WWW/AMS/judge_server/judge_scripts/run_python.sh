#!/usr/bin/env bash

# TODO: 최종적으론 makefile로 변경

# TODO: 테스트 파일 여러개 가능하도록 변경
# TODO: 테스트 파일 이름을 고정이 아니도록 변경
# TODO: entry point를

entry=$(jq '.entry_point' /source_code/config.json)

python3 /source_code/${entry} < /inputfiles/input.txt >> /source_code/result.txt
