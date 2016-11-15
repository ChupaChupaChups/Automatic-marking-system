#!/usr/bin/env bash

arg_obj=$(find /source_code -iname "*.c")
input_files=$(find /inputfiles -name "*.in")
output_files=$(find /outputfiles -name "*.out")
blank=$(jq '.problem_blank' /json_file/config.json)
flagContent=$(jq '.flagContent' /json_file/flag.json | cut -d "\"" -f 2)

declare -i correct=0
declare -i infilelen=0
declare -i resulttime=0
declare -i check=0
gcc $flagContent -o /compiler_and_judge/a.out ${arg_obj}
if [ -f /compiler_and_judge/a.out ]; then
    for input_file in $input_files; do
        infilelen=$infilelen+1
        filename=$(basename $input_file)
        (time /compiler_and_judge/a.out < $input_file > /resultfiles/${filename%.*}.out) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}' > /resultfiles/${filename%.*}.time
        temp=$(</resultfiles/${filename%.*}.time)
        if [ $temp -gt $resulttime ];
        then
            resulttime=$temp
        fi
        if [ $blank == "false" ]; then
            (cat /resultfiles/${filename%.*}.out | sed 's/ //g') > /resultfiles/temp.out
            (cat /outputfiles/${filename%.*}.out | sed 's/ //g') > /compiler_and_judge/temp.out
            if (cmp /compiler_and_judge/temp.out /resultfiles/temp.out)  2>&1 >/dev/null ;
            then
                correct=$correct+1
                check=$check+1
                rm /resultfiles/temp.out
                rm /compiler_and_judge/temp.out
            else
                if [ $check -eq 0 ]; then
                    echo "들어오는 입력 :"
                    while read temp
                    do
                        echo $temp
                    done < /inputfiles/${filename%.*}.in
                    echo ''
                    echo "예상 답안 : "
                    while read temp
                    do
                        echo $temp
                    done < /outputfiles/${filename%.*}.out
                    echo ''
                    echo "제출자 답안 : "
                    while read temp
                    do
                        echo $temp
                    done < /resultfiles/${filename%.*}.out
                    rm /resultfiles/temp.out
                    rm /compiler_and_judge/temp.out
                    break
                else
                    rm /resultfiles/temp.out
                    rm /compiler_and_judge/temp.out
                    break
                fi
            fi
        else
            if (cmp /outputfiles/${filename%.*}.out /resultfiles/${filename%.*}.out)  2>&1 >/dev/null ;
            then
                correct=$correct+1
                check=$check+1
            else
                if [ $check -eq 0 ]; then
                    echo "들어오는 입력 :"
                    while read temp
                    do
                        echo $temp
                    done < /inputfiles/${filename%.*}.in
                    echo ''
                    echo "예상 답안 : "
                    while read temp
                    do
                        echo $temp
                    done < /outputfiles/${filename%.*}.out
                    echo ''
                    echo "제출자 답안 : "
                    while read temp
                    do
                        echo $temp
                    done < /resultfiles/${filename%.*}.out
                    break
                fi
            fi
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

