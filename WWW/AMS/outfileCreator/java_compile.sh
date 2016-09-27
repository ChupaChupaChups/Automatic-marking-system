#!/usr/bin/env bash

arg_obj=$(find $1 -iname "*.java")
input_files=$(find $2 -name "*.in")

mkdir media/temp/outputfile
entry=$(jq '.entry_point' /json_file/config.json | cut -d "\"" -f 2)
echo $entry

javac -cp $1 $1/*.java -d media/temp/outputfile

for input_file in $input_files; do
    filename=$(basename $input_file)
    AMS/outfileCreator/a.out < $input_file > $3/${filename%.*}.out
done

rm AMS/outfileCreator/a.out