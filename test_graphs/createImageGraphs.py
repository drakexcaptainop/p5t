import os 
import argparse


parser = argparse.ArgumentParser()
parser.add_argument('-sp', type=str)
parser.add_argument('-ip', type=str)
args = parser.parse_args()

for fn in os.listdir( args.sp ):
    print(fn)
    os.system(
        f"dot -o {args.ip}/{fn}.png -Tpng {args.sp}/{fn}"
    )