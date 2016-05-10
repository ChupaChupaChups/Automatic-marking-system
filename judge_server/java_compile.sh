#!/usr/bin/env bash
find /source_code -iname "*.java" > /compiler_and_judge/source_list.txt
javac -cp /source_code -d /compiler_and_judge/class @/compiler_and_judge/source_list.txt

java -cp /compiler_and_judge/class:/source_code Main < /inputfiles/input.txt
