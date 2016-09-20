#!/usr/bin/env bash

input_files=$(find /inputfiles -name "*.in")
output_files=$(find /outputfiles -name "*.out")
declare -i correct=0
declare -i infilelen=0
declare -i resulttime=0

# (time python3 /source_code/$entry < /inputfiles/input.txt >> /source_code/result.txt) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}' > /resultfiles/proctime.txt

entry=$(jq '.entry_point' /json_file/config.json | cut -d "\"" -f 2)
for input_file in $input_files; do
    infilelen=$infilelen+1
    filename=$(basename $input_file)
    (time python3 /source_code/$entry < $input_file > /resultfiles/${filename%.*}.out) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}' > /resultfiles/${filename%.*}.time
    if [ $(du /resultfiles/${filename%.*}.out | cut -f1) -eq "0" ]; then
        python3 /source_code/$entry < $input_file
        break
    fi
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

chmod -R 777 /json_file