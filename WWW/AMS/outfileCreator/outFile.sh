#!/usr/bin/env bash

if [ $1 == 1 ]; then
	AMS/outfileCreator/c_compile.sh $2 $3 $4
elif [ $1 == 2 ]; then
	cpp_compile.sh $2 $3 $4
elif [ $1 == 3 ]; then
	java_compile.sh $2 $3 $4
elif [ $1 == 4 ]; then
	run_python.sh $2 $3 $4
fi