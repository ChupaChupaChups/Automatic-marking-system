find ./src -iname "*.java" > source_list.txt
javac -cp . -d class @source_list.txt

java -cp class Main
