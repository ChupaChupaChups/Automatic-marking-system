arg_objs=$(find . -iname "*.c")

gcc $arg_objs

./a.out > result.txt

