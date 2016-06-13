#!/usr/bin/env bash
lang=$(jq '.language' /source_code/config.json)

if [ $lang == 1 ]; then
	/compiler_and_judge/c_compile.sh
elif [ $lang == 2 ]; then
	/compiler_and_judge/cpp_compile.sh
elif [ $lang == 3 ]; then
	/compiler_and_judge/java_compile.sh
elif [ $lang == 4 ]; then
	/compiler_and_judge/run_python.sh
fi

# command에서 time ./a.out < input.txt이런식으로 real time을 알아냄. --> tail을 사용해서 real부분 가져오기