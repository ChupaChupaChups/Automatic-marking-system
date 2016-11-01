#!/usr/bin/env bash
arg_obj=$(find /source_code -iname "*.cpp")
input_files=$(find /inputfiles -name "*.in")
output_files=$(find /outputfiles -name "*.out")
declare -i correct=0
declare -i infilelen=0
declare -i resulttime=0
g++ -o /compiler_and_judge/a.out ${arg_obj}

if [ -f /compiler_and_judge/a.out ];
then
    for input_file in $input_files; do
        infilelen=$infilelen+1
        filename=$(basename $input_file)
        (time timeout 10s /compiler_and_judge/a.out < $input_file > /resultfiles/${filename%.*}.out) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}' > /resultfiles/${filename%.*}.time
        temp=$(</resultfiles/${filename%.*}.time)
        if [ $temp -gt $resulttime ];
        then
            resulttime=$temp
        fi
        if (cmp /outputfiles/${filename%.*}.out /resultfiles/${filename%.*}.out) 2>&1 >/dev/null ;
        then
            correct=$correct+1
        else
             echo "들어오는 입력 :"
             temp=$(head -n 1 /inputfiles/${filename%.*}.in)
             echo $temp
             echo ''
             echo "예상 답안 : "
             temp=$(head -n 1 /outputfiles/${filename%.*}.out)
             echo $temp
             temp=$(head -n 1 /resultfiles/${filename%.*}.out)
             echo ''
             echo "제출자 답안 : "
             echo $temp
             break
        fi
    done
    correct=$correct*100
    temp=$(($correct/$infilelen))
    python3 /compiler_and_judge/result_dump.py $temp $resulttime

    rm /compiler_and_judge/a.out
else
    python3 /compiler_and_judge/result_dump.py 0 0
fi

chmod -R 777 /json_file