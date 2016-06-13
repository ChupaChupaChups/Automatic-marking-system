#!/usr/bin/env bash

# TODO: 최종적으론 makefile로 변경
find /source_code -iname "*.java" > /compiler_and_judge/source_list.txt
mkdir /compiler_and_judge/class
javac -cp /source_code -d /compiler_and_judge/class @/compiler_and_judge/source_list.txt

entry=$(jq '.entry_point' /source_code/config.json)

# TODO: 테스트 파일 여러개 가능하도록 변경
# TODO: 테스트 파일 이름을 고정이 아니도록 변경
# TODO: entry point를 입력 받도록 변경


(time java -cp /compiler_and_judge/class:/source_code $entry < /inputfiles/input.txt > /source_code/result.txt) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}'

rm /compiler_and_judge/source_list.txt
rm -rf /compiler_and_judge/class
