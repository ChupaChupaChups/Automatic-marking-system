#!/usr/bin/env bash
lang=$(jq '.language' /json_file/config.json)

if [ ${lang} == 1 ]; then
	/compiler_and_judge/c_compile.sh
elif [ ${lang} == 2 ]; then
	/compiler_and_judge/cpp_compile.sh
elif [ ${lang} == 3 ]; then
	/compiler_and_judge/java_compile.sh
elif [ ${lang} == 4 ]; then
	/compiler_and_judge/run_python.sh
fi