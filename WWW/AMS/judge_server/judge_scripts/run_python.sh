#!/usr/bin/env bash

input_files=$(find /inputfiles -name "*.in")
flagContent=$(jq '.flagContent' /json_file/flag.json | cut -d "\"" -f 2)
entry=$(jq '.entry_point' /json_file/config.json | cut -d "\"" -f 2)
blank=$(jq '.problem_blank' /json_file/config.json)
declare -i correct=0
declare -i infilelen=0
declare -i resulttime=0

# (time python3 /source_code/$entry < /inputfiles/input.txt >> /source_code/result.txt) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}' > /resultfiles/proctime.txt

for input_file in $input_files; do
    infilelen=$infilelen+1
    filename=$(basename $input_file)
    (time python3 $flagContent /source_code/$entry < $input_file > /resultfiles/${filename%.*}.out) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}' > /resultfiles/${filename%.*}.time
    if [ $(du /resultfiles/${filename%.*}.out | cut -f1) -eq "0" ]; then
        break
    fi
    temp=$(</resultfiles/${filename%.*}.time)
    if [ $temp -gt $resulttime ]; then
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
if [ $infilelen -eq 0 ]; then
    temp=0
else
    temp=$(($correct/$infilelen))
fi
python3 /compiler_and_judge/result_dump.py $temp $resulttime

chmod -R 777 /json_file