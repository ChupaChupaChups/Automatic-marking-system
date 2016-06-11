#!/usr/bin/env bash

lang=$(jq -r '.language' /source_code/config.json)

if [ ${lang} == 1 ]; then
	# TODO: 최종적으론 makefile로 변경
	arg_obj=$(find /source_code -iname "*.c")

	gcc -o /compiler_and_judge/a.out ${arg_obj} > /dev/null

	python3 /compiler_and_judge/shell_executor.py "/compiler_and_judge/a.out"

elif [ ${lang} == 2 ]; then
	# TODO: 최종적으론 makefile로 변경
	arg_obj=$(find /source_code -iname "*.cpp")

	g++ -o /compiler_and_judge/a.out ${arg_obj} > /dev/null

	python3 /compiler_and_judge/shell_executor.py "/compiler_and_judge/a.out"

elif [ ${lang} == 3 ]; then
	# TODO: 최종적으론 makefile로 변경
	find /source_code -iname "*.java" > /compiler_and_judge/source_list.txt
	mkdir /compiler_and_judge/class
	javac -cp /source_code -d /compiler_and_judge/class @/compiler_and_judge/source_list.txt

	entry=$(jq '.entry_point' /source_code/config.json)

	python3 /compiler_and_judge/shell_executor.py "java -cp /compiler_and_judge/class:/source_code ${entry}"

elif [ ${lang} == 4 ]; then
	# TODO: 최종적으론 makefile로 변경

	entry=$(jq '.entry_point' /source_code/config.json)

	python3 /compiler_and_judge/shell_executor.py "python3 /source_code/${entry}"
fi
