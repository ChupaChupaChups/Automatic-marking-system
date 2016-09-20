#!/usr/bin/env bash

# TODO: 최종적으론 makefile로 변경
#find /source_code -iname "*.java" > /compiler_and_judge/source_list.txt
arg_obj = $(find /source_code -iname "*.java" > /compiler_and_judge/source_list.txt)
console.log(arg_obj);
input_files=$(find /inputfiles -name "*.in")
output_files =$(find /outputfiles -name "*.out")
declare -i correct=0
declare -i infilelen=0
declare -i resulttime=0

mkdir /compiler_and_judge/class
javac -cp /source_code -d /compiler_and_judge/class @/compiler_and_judge/source_list.txt

entry=$(jq '.entry_point' /source_code/config.json)
javac -cp /source_code -d /compiler_and_judge/class @/compiler_and_judge/source_list.txt


# TODO: 테스트 파일 여러개 가능하도록 변경
# TODO: 테스트 파일 이름을 고정이 아니도록 변경
# TODO: entry point를 입력 받도록 변경
for input_file in $input_files; do
    infilelen = $infilelen+1
    filename=$(basenaem $input_file)
    (time java -cp /compiler_and_judge/class:/source_code $entry < /inputfiles/input.txt > /source_code/result.txt) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}'
    temp = $(</resultfiles/${filename%.*}.time)
    if[$temp -gt $resulttime];
    then
        resulttime=$temp
    fi
    for output_file in $output_files; do
       if (cmp $output_file /resultfiles/${filename%.*}.out) 2>&1 >/dev/null;
       then
            correct=$correct+1
       fi
    done
done
correct = $correct*100
temp=$(($correct/$infilelen))
python3 /compiler_and_judge/result_dump.py $temp $resulttime


rm /compiler_and_judge/source_list.txt
rm -rf /compiler_and_judge/class
