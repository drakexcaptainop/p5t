import os 

for fn in os.listdir( os.curdir ):
    print(fn)
    os.system(
        f"dot -o ../../img_graphs/{fn}.png -Tpng {fn}"
    )