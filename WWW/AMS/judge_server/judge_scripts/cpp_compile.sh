#!/usr/bin/env bash

arg_obj=$(find /source_code -iname "*.c")
input_files=$(find /inputfiles -name "*.in")
blank=$(jq '.problem_blank' /json_file/config.json)
flagContent=$(jq '.flagContent' /flagfiles/flag.json | cut -d "\"" -f 2)

declare -i correct=0
declare -i infilelen=0
declare -i resulttime=0
declare -i check=0

cc=false

g++ $flagContent -o /compiler_and_judge/a.out ${arg_obj}
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
            if [ $infilelen == 1 ]; then
                python3 /compiler_and_judge/correctCheck.py /resultfiles/${filename%.*}.out /outputfiles/${filename%.*}.out 0 0
            else
                python3 /compiler_and_judge/correctCheck.py /resultfiles/${filename%.*}.out /outputfiles/${filename%.*}.out 0 1
            fi
            returnval=$?
            if [ $returnval == 1 ]; then
                correct=$correct+1
            elif [ $cc == 0 ]; then
                python3 /compiler_and_judge/makeHint.py $input_file /outputfiles/${filename%.*}.out /json_file
                cc=$cc+1
            fi
        else
            if [ $infilelen == 1 ]; then
                python3 /compiler_and_judge/correctCheck.py /resultfiles/${filename%.*}.out /outputfiles/${filename%.*}.out 1 0
            else
                python3 /compiler_and_judge/correctCheck.py /resultfiles/${filename%.*}.out /outputfiles/${filename%.*}.out 1 1
            fi
            returnval=$?
            if [ $returnval == 1 ]; then
                correct=$correct+1
            elif [ $cc == 0 ]; then
                python3 /compiler_and_judge/makeHint.py $input_file /outputfiles/${filename%.*}.out /json_file
                cc=$cc+1
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

