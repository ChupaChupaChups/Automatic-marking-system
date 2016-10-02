#!/usr/bin/env bash

arg_obj=$(find $1 -iname "*.c")
input_files=$(find $2 -name "*.in")

mkdir media/temp/outputfile
gcc -o AMS/outfileCreator/a.out ${arg_obj}

for input_file in $input_files; do
    filename=$(basename $input_file)
    AMS/outfileCreator/a.out < $input_file > $3/${filename%.*}.out
done

rm AMS/outfileCreator/a.out