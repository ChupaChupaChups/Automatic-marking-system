arg_objs=$(find . -iname "*.cpp")

g++ $arg_objs

./a.out > result.txt

