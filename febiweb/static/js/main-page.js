
        // const rightArrows = document.getElementsByClassName("rightarrow")

        folderSizes = ['120', '240', '360', '480', '600', '720', '840', '960']

        
        // mainImgs[0].src = "{{ url_for('static', filename='assets/product1/1-1.jpg') }}"
        pageWidth = getWidth()
        mainImgs[0].src = whichImageForSize(mainImPath1, pageWidth)
        mainImgs[1].src = whichImageForSize(mainImPath2, pageWidth)
        console.log("Main im is set to: ", mainImgs[0].src)
        console.log("Main im 2 is set to: ", mainImgs[1].src)

        // let startIndex = [0, 0, 0]
        let startIndex = [0, 0]
        for (var i=0; i<mainImgs.length; i++){

            // Set the thumbnails
            setImages(startIndex[i], i, mainImgs[i])
            
            // The img tag for the main image has a click listener. 
            // This is independent of what img src is in the img tag
            mainImgs[i].addEventListener('click', clickPrevNext)
            // Store the index so we know what image is next/previous
            mainImgs[i].imageIndx = 0
            // Which product number is this
            mainImgs[i].prodIndx = i

        }
        console.log("main width: ", mainImgs[0].width)
        // for (var i=0; i<rightArrows.length; i++){
        //     rightArrows[i].addEventListener('click', rotateImages)
        //     rightArrows[i].imageIndex = i
        // }

        function setImages(start, productIndex, mainim) {
            // maxImages = 6   // What is this 
            febImages = allims[productIndex]
            
            // imgRow = elemByIndex(productIndex, "choiceblock")
            imgRow = elemByIndex(productIndex, "scroll-thumbnail")
            let febiImg;
            // for (let step = start; step < start + maxImages; step++) {
            for (let step = start; step < febImages.length; step++) {
                imgIndex = step % febImages.length
                febiImg = document.createElement('img');
                febiImg.className = "thumb-image"
                // febiImg.src = 
                imgRow.appendChild(febiImg)
                // console.log("im width:", febiImg.clientWidth)
                // console.log("im width:", febiImg.offsetWidth)
                // console.log("im width:", febiImg.getBoundingClientRect().height)
                pageWidth = getWidth()
                imgWidth = pageWidth*0.23
                febiImg.src = whichImageForSize(febImages[imgIndex], imgWidth)
                // febiImg.src = febImages[imgIndex]
                febiImg.addEventListener('click', setImageMain)
                // febiImg.thismainimg = mainim
                febiImg.prodIndx = productIndex
                febiImg.imageIndx = step
            }
            imchildrn = imgRow.childNodes;
            console.log("main size: ", mainImgs[0].width)
            console.log("size: ", imchildrn.length)
            for (let step = start; step < imchildrn.length; step++) {
                chwidth = imchildrn[step].clientWidth
                chwidth = imchildrn[step].width
                console.log("Ch width:", chwidth)
            }

        }

        function getWidth() {
            return Math.max(
              document.body.scrollWidth,
              document.documentElement.scrollWidth,
              document.body.offsetWidth,
              document.documentElement.offsetWidth,
              document.documentElement.clientWidth
            );
          }


        function setImageMain(evt) {
            // Set the source of the clicked image to be the source of the main image
            console.log("Main size: ", mainImgs[evt.target.prodIndx].clientWidth)
            pathToBigSize = fullImPathFromSmall(evt.target.currentSrc)
            appropriateSize = whichImageForSize(pathToBigSize, getWidth())
            mainImgs[evt.target.prodIndx].src = appropriateSize;
            mainImgs[evt.target.prodIndx].imageIndx = evt.target.imageIndx
            console.log(evt.target.width)
        }

        function fullImPathFromSmall(pathToSmall){
            
            var res = pathToSmall.split("/");
            filename = res.pop()
            folderToDrop = res.pop()    // Don't user this var
            res.push(filename)
            
            res = pathJoin(res, '/');
            console.log("Old: ", pathToSmall, ", new: ", res)
            return res
        }

        function whichImageForSize(path, imWidth){
            // path example:    /path/img/1-1.jpg
            // Wanted path:     /path/img/240/1-1.jpg
            choosenSize = null;
            console.log("Fetching im for size: ", imWidth)
            for (let i=0; i<folderSizes.length; i++){
                // console.log("wafsgasFetching im for size: ", imWidth)
                thisSize = parseInt(folderSizes[i])
                // console.log("Checking x,y: ", thisSize, " ", imWidth)
                if (thisSize > imWidth){
                
                    // TODO: Different file systems have forward slash
                    var res = path.split("\\");
                    if (res.length <= 1){
                        res = path.split("/");
                    }
                    filename = res.pop()
                    // console.log('Loading file: ', res)
                    res.push(folderSizes[i])
                    // console.log('Loading file: ', res)
                    res.push(filename)
                    // console.log('Loading file: ', res)
                    res = makeRelPath(res)
                    // console.log('LRel path: ', res)
                    res = pathJoin(res, '/');   // TODO: should be backslash?? 
                    // console.log('Loading file: ', res)
                    // if(res.exists()){
                    //     print("Exists!")
                    // } else {
                    //     print("Nada on the exists")
                    // }
                    // console.log("Decided on ", res, ", size: ", folderSizes[i])
                    return res
                }
            }
            
            var res = path.split("\\");
            if (res.length <= 1){
                res = path.split("/");
            }
            filename = res.pop()
            res.push('960')
            res.push(filename)
            res = makeRelPath(res)
            res = pathJoin(res, '/');   // TODO: should be backslash?? 
            // if(res.exists()){
            return res;
        }

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

        function pathJoin(parts, sep){
            var separator = sep || '/';
            var replace   = new RegExp(separator+'{1,}', 'g');
            return parts.join(separator).replace(replace, separator);
         }

        function clickPrevNext(evt){
            thisProdImages = allims[evt.target.prodIndx]
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


        function elemByIndex(indx, clsName){
            choiceBlocks = document.getElementsByClassName(clsName);
            return choiceBlocks[indx]
        }

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
