

        folderSizes = ['120', '240', '360', '480', '600', '720', '840', '960']
        
        const mainImgs = document.getElementsByClassName("product-main-img")
        
        pageWidth = getWidth()
        for (let i=0; i<mainImgs.length; i++){
            mainImgs[i].src = PRODUCT_IMAGES[i][0]
        }

        // For each main image set click listeners on the left and right of the image
        // Load up the thumbnails of each
        for (var i=0; i<mainImgs.length; i++){
            // This click listener is independent of what img src is in the img tag
            mainImgs[i].addEventListener('click', clickPrevNext)
            // Store the index so we know what image is next/previous
            mainImgs[i].imageIndx = 0
            // Which product number is this
            mainImgs[i].prodIndx = i

            // Set the thumbnails
            setImages(i, mainImgs[i])
        }

        // Set the thumbnails on a main image
        function setImages(productIndex, mainim) {
            // Images for this specific product
            febImages = PRODUCT_IMAGES[productIndex]
            // Find the scroll bar for this product
            imgRow = elemByIndex(productIndex, "scroll-thumbnail")
            let febiImg;
            // For each image, set a thumbnail of it
            for (let step = 0; step < febImages.length; step++) {
                // We create a new <img> tag to hold the thumbnail and add it to the scroll
                febiImg = document.createElement('img');
                febiImg.className = "thumb-image"
                imgRow.appendChild(febiImg)
                // Width of the page so we can load appropriate image sizes
                pageWidth = getWidth()
                imgWidth = pageWidth*0.23
                // TODO: Do this after layout?? Saves time
                febiImg.src = whichImageForSize(febImages[step], imgWidth)
                console.log("Loaded: ", febiImg.src)
                // If you click the thumbnail it moves to become the main image
                febiImg.addEventListener('click', setImageMain)
                // Info about thumbnail. Which product it belongs to and position in the scroll
                febiImg.prodIndx = productIndex
                febiImg.imageIndx = step
            }
        }

        
        window.addEventListener("load", function(){
            imgRow = elemByIndex(0, "scroll-thumbnail")
            imchildrn = imgRow.childNodes;
            console.log("main size: ", mainImgs[0].width)
            console.log("number thumbs: ", imchildrn.length)
            for (let step = 0; step < imchildrn.length; step++) {
                chcwidth = imchildrn[step].clientWidth
                chwidth = imchildrn[step].width
                console.log("Ch width:", chwidth)
                console.log("Ch client width:", chcwidth)
            }

        });

        // Get the width of the screen
        function getWidth() {
            return Math.max(
              document.body.scrollWidth,
              document.documentElement.scrollWidth,
              document.body.offsetWidth,
              document.documentElement.offsetWidth,
              document.documentElement.clientWidth
            );
          }

        // Set the clicked thumnnail to be the main image
        function setImageMain(evt) {
            console.log("Main size: ", mainImgs[evt.target.prodIndx].clientWidth)
            // Get full size image for the thumbnail
            pathToBigSize = fullImPathFromSmall(evt.target.currentSrc)
            // Get an appropriate size for the full image
            appropriateSize = whichImageForSize(pathToBigSize, getWidth())
            // Replace main image with the newly decided image
            mainImgs[evt.target.prodIndx].src = appropriateSize;
            // Update the main <img> tag with index of which image it is
            mainImgs[evt.target.prodIndx].imageIndx = evt.target.imageIndx
        }

        // Get the appropriate full size 'main' image from its thumbnail
        // Example:     product1/480/img.png  ->   product1/img.png
        function fullImPathFromSmall(pathToSmall){
            var res = pathToSmall.split("/");
            filename = res.pop()
            // Drop the thumbnail folder
            res.pop()    
            res.push(filename)
            res = pathJoin(res, '/');
            return res
        }

        // Get a thumbnail of desired size from the path to a full image
        // Example:
        //          input:      product1/img.jpg, 480
        //          return:     product1/480/img.jpg
        function smallPathFromFull(imgPath, size){
            // Different file systems have forward slash
            var res = imgPath.split("\\");
            if (res.length <= 1){
                res = imgPath.split("/");
            }
            filename = res.pop()
            res.push(size)
            res.push(filename)
            res = makeRelPath(res)
            res = pathJoin(res, '/');   // TODO: should be backslash?? 
            return res
        }

        // Return an image of next highest width for the input width
        // example:
        //      input:       /path/img/1-1.jpg, 207
        //      return:      /path/img/240/1-1.jpg
        function whichImageForSize(path, imWidth){
            choosenSize = null;
            for (let i=0; i<folderSizes.length; i++){
                thisSize = parseInt(folderSizes[i])
                if (thisSize > imWidth){
                    return smallPathFromFull(path, thisSize)
                }
            }
            return smallPathFromFull(path, '960');
        }

        // Convert absolute path into path relative to static folder
        function makeRelPath(pathArray){
            newPathArray = []
            for (let x=pathArray.length -1; x != 0; x--){

                newPathArray.unshift(pathArray[x])
                if (pathArray[x] == 'static'){
                    newPathArray.unshift('..')
                    break;
                }
            }
            return newPathArray
        }

        // Create a directory path from a list of strings
        // ['path', 'to', 'folder']     ->      '/path/to/folder'
        function pathJoin(parts, sep){
            var separator = sep || '/';
            var replace   = new RegExp(separator+'{1,}', 'g');
            return parts.join(separator).replace(replace, separator);
         }

        // Move either left or right by 1 image based on where the user has clicked
        // Click on the left 1/3 to move to the left, and vice versa
        function clickPrevNext(evt){
            thisProdImages = PRODUCT_IMAGES[evt.target.prodIndx]
            thisThumbnailIndex = evt.target.imageIndx
            imglen = evt.target.width;
            
            xLocation = evt.clientX;
            nextIndex = null;
            if (xLocation < imglen / 3){
                nextIndex = thisThumbnailIndex - 1
                if (nextIndex < 0) {
                    nextIndex = nextIndex + thisProdImages.length
                } 
            } else if (xLocation > 2 * imglen / 3) {
                nextIndex = (thisThumbnailIndex + 1) % thisProdImages.length
            }
            if (nextIndex != null){
                evt.target.imageIndx = nextIndex
                evt.target.src = thisProdImages[nextIndex]

            } 
        }

        // Return the nth element which matches given class name
        function elemByIndex(indx, clsName){
            choiceBlocks = document.getElementsByClassName(clsName);
            return choiceBlocks[indx]
        }


        
        // let startIndex = [0, 0]
        // function rotateImages(evt) {
        //     imgindx = evt.target.imageIndex
        //     startIndex[imgindx] = startIndex[imgindx] + 1
        //     imgRow = elemByIndex(imgindx, "choiceblock")
        //     // imgRow = document.getElementsByClassName("choiceblock"); 
        //     while (imgRow.firstChild) {
        //         imgRow.removeChild(imgRow.firstChild);
        //     }

        //     setImages(startIndex[imgindx], imgindx, mainImgs[imgindx])
        // }
