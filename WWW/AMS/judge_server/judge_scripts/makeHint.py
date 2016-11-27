import os, sys
import json

def makeHint():
    hintpath = os.path.join(sys.argv[3], 'hint.txt')
    f = open(hintpath, 'w')
    f.write("Input\n")
    with open(sys.argv[1], 'r') as infile:
        in_data = infile.read()
        for data in in_data.split('\n'):
            f.write(data)
        infile.close()
    f.write("\nOutput\n")
    with open(sys.argv[2], 'r') as outfile:
        out_data = outfile.read()
        for data in out_data.split('\n'):
            f.write(data)
        outfile.close()
    f.close()
if __name__ == "__main__":
    makeHint()
