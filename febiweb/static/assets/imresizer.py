
# from PIL import Image

# basewidth = 300
# img = Image.open('somepic.jpg')
# wpercent = (basewidth/float(img.size[0]))
# hsize = int((float(img.size[1])*float(wpercent)))
# img = img.resize((basewidth,hsize), Image.ANTIALIAS)
# img.save('sompic.jpg') 

import os
import sys
from PIL import Image

from resizeimage import resizeimage



def loadIms(productDir):
    # print(os.listdir(productDir))
    imgs = [os.path.join(productDir, im) for im in os.listdir(productDir) if os.path.isfile(os.path.join(productDir, im))]
    return imgs

folderSizes = ['120', '240', '360', '480', '600', '720', '840', '960']

# prodPath = '.\product1'
prodPath = sys.argv[1]

prims = loadIms(prodPath)

print("prims:", prims)

for imge in prims:
    filename = os.path.basename(imge)
    direcname = os.path.dirname(imge)
    # print(filename)
    # print(direcname)
    # print(imge)
    outdir = 'small'
    with open(imge, 'r+b') as f:
        for outdir in folderSizes:
            baseWidth = int(outdir)
            # height
            outdirPath = os.path.join(prodPath, outdir)
            if not os.path.exists(outdirPath):
                print("Creating {} ..".format(outdirPath))
                os.makedirs(outdirPath)
            print("Generating for {} ..".format(outdirPath))
            with Image.open(f) as image:
                try:
                    cover = resizeimage.resize_width(image, baseWidth)
                    # cover = resizeimage.resize_cover(image, [200, 100])
                    cover.save(os.path.join(prodPath, outdir, filename), image.format)
                except:
                    print("Skipping {} for size {}".format(filename, baseWidth))
                    continue

