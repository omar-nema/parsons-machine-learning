//CREATE SPRITE
function createSprite(currResource, x, y){
    const padding = .1;
    let sprite = new PIXI.Sprite(currResource.texture);
    let spriteX = x*(unitSize)+padding*.5*unitSize;
    let spriteY = y*(unitSize)+padding*.5*unitSize;
    sprite.x = spriteX;
    sprite.y = spriteY;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    scaleRatio = unitSize/Math.max(sprite.width, sprite.height);
    sprite.width = sprite.width*scaleRatio*(1-padding);
    sprite.height = sprite.height*scaleRatio*(1-padding);
    sprite.interactive = true;

    let lastX;
    let lastY;
    sprite.on('mousedown', (e)=>{
        console.log(e, e.data.global.x)
        lastX = e.data.global.x;
        lastY = e.data.global.y;
    
    });
    sprite.on('mouseup', (e)=>{
        let moveThreshold = .5;
        let xMoved = e.data.global.x > (moveThreshold+lastX) || e.data.global.x < (lastX-moveThreshold);
        let yMoved = e.data.global.y > (moveThreshold+lastY) || e.data.global.y < (lastY-moveThreshold);  
        if (!xMoved && !yMoved){
            zoomIntoSprite(sprite, spriteX, spriteY); 
        };
    });

    sprite.on('mouseover', (d)=> {
        document.querySelector("canvas").style.cursor = "pointer";
    });
    sprite.on('mouseout', (d)=>{
        document.querySelector("canvas").style.cursor = "inherit";
    })
    return sprite;
}

// ZOOM INTO SPRITE AND HIDE NEARBY SPRITES
function updateSpriteRes(){
    let hitArea = viewport.hitArea;
    let filterSprites = spriteHolder.filter(d=> {
        return d.x >= hitArea.x && d.x <= (hitArea.x+hitArea.width) && d.y >= hitArea.y && d.y <= (hitArea.y+hitArea.height)
    });
    if (filterSprites.length < 10){
        filterSprites.forEach( d => {
            if (!d.highRes){
                let highResTexture = './poster-assets/' + d.texture.textureCacheIds[0] + '.jpg';
                let textId = d.texture.textureCacheIds[0];
                highResText = PIXI.Texture.from(highResTexture);
                d.texture = highResText;    
                //id gets generated differently this time, correct for that
                let fileName = d.texture.textureCacheIds[0].split("/").pop();
                let fileId =  fileName.substr(0, fileName.lastIndexOf("."))
                d.texture.textureCacheIds = [fileId, d.texture.textureCacheIds[0]]
                d.highRes = true;
            }
        });           
    }
    return filterSprites;
}
function zoomIntoSprite(sprite, x, y){  
    if (!x){
        x = sprite.x;
    }
    if (!y){
        y = sprite.y;
    }
    let key = sprite.texture.textureCacheIds[0];
    viewport.animate({
        time: 300,
        scale: viewport.screenWidth/(2.2*unitSize),
        position: {x: x ,y: y}
    });
    setTimeout(function() {
        hitArea = viewport.hitArea;
        let xPadding =  ( 100*(1-(unitSize/hitArea.width))/2 ) + '%';
        let yPadding =  ( 100*(1-(unitSize/hitArea.height))/2 ) + '%';   
        hideAdjacentImages(xPadding, yPadding);
    }, 300)
    
    populateTooltip(posterAttr[key]) ;
    updateSpriteRes();
}
function hideAdjacentImages(xPadding, yPadding){
    pl = document.querySelector('.img-padding.left');
    pr = document.querySelector('.img-padding.right');
    pt = document.querySelector('.img-padding.top');
    pb = document.querySelector('.img-padding.bottom');
    pl.style.width = xPadding;
    pr.style.width = xPadding;
    pt.style.height = yPadding;
    pb.style.height = yPadding;   
}

//POPUATE METADATA POPUP
let tooltip = document.querySelector('#poster-tooltip');
function populateTooltip(posterData){
    tooltip.innerHTML = '';
    let posterBody = document.createElement('div');
    posterBody.className = 'tip-body';

    let posterClose = document.createElement('div');
    posterClose.innerHTML = '<div class="btn-row"><div class="btn btn-close"><span>Close</span></div></div>';
    tooltip.appendChild(posterClose);
    document.querySelector('.btn-close').addEventListener('click', ()=>{
        hideTooltip();
        viewport.animate({
            time: 300,
            scale: 5,
        });
    })
 
    let posterFooter = document.createElement('div');
    posterFooter.className = 'btn-row two-col';
    posterFooter.innerHTML = '<div class="btn" id="btn-previous">Previous</div><div class="btn" id="btn-next">Next</div>';
    
    let posterTitle = document.createElement('div');
    posterTitle.className = 'poster-title';
    posterTitle.innerHTML = `<div class="poster-title"><span>${posterData['Title']}</span><span class="date">${posterData['Date']}</span></div>`;
    posterBody.appendChild(posterTitle);
    
    let attributes = [ 'Artist', 'Iconography', 'Language', 'Link'];
    attributes.forEach(d=> {
        attr = posterData[d];
        if (attr){
            let metaDataGrp = document.createElement('div');
            metaDataGrp.className = 'metadata-val'

            let metaDataLabel = document.createElement('div');
            metaDataLabel.className = 'label';
            metaDataLabel.innerText = d;
            
            let metaDataValue = document.createElement('div');
            metaDataValue.className = 'value';
            let htmlString = '';

            if (Array.isArray(attr)){
                attr.forEach(val => {
                    htmlString += `<span>${val}</span>`
                })
            } else {
                if (d == 'Link'){
                    htmlString = `<a href="${attr}">PPP Link<a>`
                } else {

                    htmlString = attr;            }

            }
            metaDataValue.innerHTML = htmlString;

            metaDataGrp.appendChild(metaDataLabel);
            metaDataGrp.appendChild(metaDataValue)
            posterBody.appendChild(metaDataGrp)
        }
    });
      
    tooltip.appendChild(posterBody);
    tooltip.appendChild(posterFooter);
    tooltip.className = ''; 

    document.querySelector('#btn-next').addEventListener('click', ()=>{
        let nextSprite = getRelativeSprite(posterData.Id, 1);
        zoomIntoSprite(nextSprite);
    });
    document.querySelector('#btn-previous').addEventListener('click', ()=>{
        let prevSprite = getRelativeSprite(posterData.Id, -1);
        zoomIntoSprite(prevSprite);
    });

}
function hideTooltip(){
    document.querySelector('.img-padding.left').style.width = 0;
    document.querySelector('.img-padding.right').style.width = 0;
    document.querySelector('.img-padding.top').style.height = 0;
    document.querySelector('.img-padding.bottom').style.height = 0;          
    tooltip.className = 'hidden' ;
}