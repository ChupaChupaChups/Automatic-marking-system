#!/usr/bin/env bash
arg_objs=$(find /source_code -iname "*.c")

gcc-5 -o /compiler_and_judge/a.out $arg_objs

/compiler_and_judge/a.out < /inputfiles/input.txt > /source_code/result.txt

