
        // const rightArrows = document.getElementsByClassName("rightarrow")

        // let startIndex = [0, 0, 0]
        let startIndex = [0]
        for (var i=0; i<mainImgs.length; i++){
            setImages(startIndex[i], i, mainImgs[i])

        }
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
                febiImg.src = febImages[imgIndex]
                imgRow.appendChild(febiImg)
                febiImg.addEventListener('click', setImageMain)
                // febiImg.thismainimg = mainim
                febiImg.prodIndx = productIndex
                febiImg.imageIndx = step
            }
        }

        // The img tag for the main image has a click listener. 
        // This is independent of what img src is in the img tag
        mainImgs[0].addEventListener('click', clickPrevNext)
        // Store the index so we know what image is next/previous
        mainImgs[0].imageIndx = 0
        // Which product number is this
        mainImgs[0].prodIndx = 0

        function setImageMain(evt) {
            // Set the source of the clicked image to be the source of the main image
            mainImgs[evt.target.prodIndx].src = evt.target.currentSrc;
            mainImgs[evt.target.prodIndx].imageIndx = evt.target.imageIndx
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
