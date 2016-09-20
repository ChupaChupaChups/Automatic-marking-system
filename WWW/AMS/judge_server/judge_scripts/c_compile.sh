#!/usr/bin/env bash

# TODO: 최종적으론 makefile로 변경
arg_obj=$(find /source_code -iname "*.c")
input_files=$(find /inputfiles -name "*.in")
output_files=$(find /outputfiles -name "*.out")
declare -i correct=0
declare -i infilelen=0
declare -i resulttime=0
gcc -o /compiler_and_judge/a.out ${arg_obj}

# TODO: 테스트 파일 여러개 가능하도록 변경
# TODO: 테스트 파일 이름을 고정이 아니도록 변경
for input_file in $input_files; do
    infilelen=$infilelen+1
    filename=$(basename $input_file)
    (time /compiler_and_judge/a.out < $input_file > /resultfiles/${filename%.*}.out) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}' > /resultfiles/${filename%.*}.time
    temp=$(</resultfiles/${filename%.*}.time)
    if [ $temp -gt $resulttime ];
    then
        resulttime=$temp
    fi
    for output_file in $output_files; do
        if (cmp $output_file /resultfiles/${filename%.*}.out) 2>&1 >/dev/null ;
        then
            correct=$correct+1
        fi
    done
done
correct=$correct*100
temp=$(($correct/$infilelen))
python3 /compiler_and_judge/result_dump.py $temp $resulttime
rm -rf /resultfiles
rm /compiler_and_judge/a.out

