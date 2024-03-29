import os
from febiweb import app
from flask import render_template, request, url_for



@app.route("/")
@app.route("/home")
@app.route("/index")
def home():
    return render_template('home.html', productImages=loadProductImages())


def loadProductImages():
    staticFolder = os.path.join(app.root_path, 'static', 'assets')
    productDirs = []
    for assetItem in os.listdir(staticFolder):
        assetItemPath = os.path.join(staticFolder, assetItem)
        if os.path.isdir(assetItemPath):
            productDirs.append(assetItemPath)
    productPaths = []
    productDirs = sorted(productDirs)
    for x, prodDir in enumerate(productDirs):
        prodname = 'product' + str(x+1)
        justFiles = [
            imgfile for imgfile in os.listdir(prodDir) 
            if os.path.isfile(os.path.join(prodDir, imgfile))
        ]
        pathsThisProduct = [
            os.path.join('..', 'static', 'assets', prodname, productImage) 
            for productImage in justFiles
            # if os.path.isfile(os.path.join('..', 'static', 'assets', prodname, productImage) )
            ]
        productPaths.append(pathsThisProduct)
    return productPaths
