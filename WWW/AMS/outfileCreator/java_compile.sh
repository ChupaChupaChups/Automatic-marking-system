#!/usr/bin/env bash

arg_obj=$(find $1 -iname "*.java" > AMS/outfileCreator/source_list.txt)
input_files=$(find $2 -name "*.in")

mkdir $3

javac -cp $1 $1/*.java -d AMS/outfileCreator/class

for input_file in $input_files; do
    filename=$(basename $input_file)
    AMS/outfileCreator/a.out < $input_file > $3/${filename%.*}.out
done

rm AMS/outfileCreator/a.out