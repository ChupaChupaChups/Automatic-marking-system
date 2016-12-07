#!/usr/bin/env bash

entry_point="$4"
input_files=$(find "$2" -name "*.in")

mkdir "$3"

IFS=$'\n'

for input_file in $input_files; do
	filename=$(basename "$input_file")
	python3 "$1"/"$4" < "$input_file" > "$3"/${filename%.*}.out
done
