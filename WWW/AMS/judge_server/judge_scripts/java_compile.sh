#!/usr/bin/env bash

#find /source_code -iname "*.java" > /compiler_and_judge/source_list.txt
arg_obj=$(find /source_code -iname "*.java" > /compiler_and_judge/source_list.txt)
input_files=$(find /inputfiles -name "*.in")
output_files=$(find /outputfiles -name "*.out")
flagContent=$(jq '.flagContent' /flagfiles/flag.json | cut -d "\"" -f 2)
blank=$(jq '.problem_blank' /json_file/config.json)
declare -i correct=0
declare -i infilelen=0
declare -i resulttime=0

mkdir /compiler_and_judge/class
entry=$(jq '.entry_point' /json_file/config.json | cut -d "\"" -f 2)

javac -cp /source_code /source_code/*.java -d /compiler_and_judge/class
if [ $(du -sb /compiler_and_judge/class | cut -f1) -ne '4096' ]; then
    for input_file in $input_files; do
        infilelen=$infilelen+1
        filename=$(basename $input_file)
        (time java $flagContent -cp /compiler_and_judge/class $entry < $input_file > /resultfiles/${filename%.*}.out) 2>&1 >/dev/null | tail -n 3 |head -1 | awk '{print $2}' | awk 'BEGIN {FS="[ms]"} {print ($1*60000+$2*1000)}' > /resultfiles/${filename%.*}.time
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

    rm -rf /compiler_and_judge/class
    rm /compiler_and_judge/source_list.txt
else
    python3 /compiler_and_judge/result_dump.py 0 0
fi
chmod -R 777 /json_file
