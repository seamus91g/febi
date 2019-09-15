#!/usr/bin/env python3
# from PIL import Image

# basewidth = 300
# img = Image.open('somepic.jpg')
# wpercent = (basewidth/float(img.size[0]))
# hsize = int((float(img.size[1])*float(wpercent)))
# img = img.resize((basewidth,hsize), Image.ANTIALIAS)
# img.save('sompic.jpg') 

import os
import sys
import argparse
from PIL import Image

from resizeimage import resizeimage

IMG_EXTS = {'.jpg', '.png', '.webp'}
FOLDER_SIZES = ['120', '240', '360', '480', '600', '720', '840', '960']


# Return list containing a path to each file in a given directory
def loadIms(productDir):
    imgs = [os.path.join(productDir, im) 
            for im in os.listdir(productDir) 
            if os.path.isfile(os.path.join(productDir, im))
            if any([im.endswith(isImg) for isImg in IMG_EXTS])
        ]
    return imgs


# For each image in given directory, create an output sized to each of given folderSizes
def resizeImages(productDirectory, folderSizes):
    import shutil
    # Find all the images in the given directory
    productImages = loadIms(productDirectory)


    for x, prdImage in enumerate(productImages):
        print("Image {} out of {}".format(x+1, len(productImages)))
        filename = os.path.basename(prdImage)
        # direcname = os.path.dirname(prdImage)

        with open(prdImage, 'r+b') as imageFile:
            # Create a new image for each of the given sizes
            for outdir in folderSizes:
                # The given size is used for the width
                baseWidth = int(outdir)
                # We need a folder for each size, create if it doesn't exist already
                outdirPath = os.path.join(productDirectory, outdir)
                if not os.path.exists(outdirPath):
                    print("Creating {} ..".format(outdirPath))
                    os.makedirs(outdirPath)
                pathResizedImage = os.path.join(productDirectory, outdir, filename)
                print("Generating for {} ..".format(outdirPath))
                with Image.open(imageFile) as image:
                    currentWidth, _ = image.size
                    if currentWidth > baseWidth:
                        cover = resizeimage.resize_width(image, baseWidth)
                        cover.save(pathResizedImage, image.format)
                    else:
                        print("Image smaller than resize. Copying unmodified {} to {}".format(prdImage, pathResizedImage))
                        shutil.copy(prdImage, pathResizedImage)

def pngToJpg(pngPath, jpgPath):
        im = Image.open(pngPath)
        rgb_im = im.convert('RGB')
        rgb_im.save(jpgPath)


def copyDirToJpg(productDirectory, outDirectory):
    productImages = loadIms(productDirectory)
    # outDirectory = os.path.join(productDirectory, 'jpgs')
    if not os.path.exists(outDirectory):
        os.makedirs(outDirectory)
    for prodImage in productImages:
        filename = os.path.basename(prodImage)
        jpgFilename = filename.split('.png')[0] + '.jpg'
        outPath = os.path.join(outDirectory, jpgFilename)
        print("Converting {} to {}".format(prodImage, outPath))
        pngToJpg(prodImage, outPath)


def onePngToJpg(oldPng, newJpgPath):
    newDir = os.path.dirname(newJpgPath)
    if newDir and not os.path.exists(newDir):
        os.makedirs(os.path.dirname(newJpgPath))
    if not newJpgPath.endswith('.jpg'):
        newJpgPath = newJpgPath + '.jpg'
    pngToJpg(oldPng, newJpgPath)


# 1. resize a folder of images
# 2. convert pngs in inputDir to jpgs in outDir
# 3. convert a single given png to a jpg of given name

def main():
    parser = argparse.ArgumentParser(description="Format images")
    parser.add_argument("-r", "--resize", action='store_true')
    parser.add_argument("-i", "--inputDir")
    parser.add_argument("-o", "--outDir")
    parser.add_argument("-j", "--newJpg")
    parser.add_argument("-p", "--png")
    args = parser.parse_args()
    # Can't specify an out dir when resizing multiple
    if args.resize and any([args.outDir, args.newJpg, args.png]):
        sys.exit("Can't specify an out dir when resizing multiple")

    # prodPath = sys.argv[1]
    if args.resize and not args.inputDir:
        sys.exit("Must give input dir with --resize")
    if args.resize and args.inputDir:
        resizeImages(args.inputDir, FOLDER_SIZES)
    elif args.inputDir and args.outDir:
        copyDirToJpg(args.inputDir, args.outDir)
    elif args.png and args.newJpg:
        onePngToJpg(args.png, args.newJpg)
    else:
        sys.exit("Doing nothing ... Check your args")

if __name__ == '__main__':
    main()

