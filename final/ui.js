// TOOLTIP AND SPRITE CREATION
let tooltip = document.querySelector('#poster-tooltip');
let zoomedRestore = 5;

function populateTooltip(posterData){
    tooltip.style.opacity = 1;
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
            scale: zoomedRestore,
        });
    })
 
    let posterFooter = document.createElement('div');
    posterFooter.className = 'btn-row two-col';
    posterFooter.innerHTML = '<div class="btn">Previous</div><div class="btn">Next</div>';
    
    let posterTitle = document.createElement('div');
    posterTitle.className = 'poster-title';
    posterTitle.innerHTML = `<div class="poster-title"><span>${posterData['Title']}</span><span class="date">${posterData['Date']}</span></div>`;
    posterBody.appendChild(posterTitle);
    
    let attributes = ['Artist', 'Iconography', 'Language', 'Link', 'Title'];
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
                htmlString = attr;
            }
            metaDataValue.innerHTML = htmlString;

            metaDataGrp.appendChild(metaDataLabel);
            metaDataGrp.appendChild(metaDataValue)
            posterBody.appendChild(metaDataGrp)
        }
    })
      
    tooltip.appendChild(posterBody);
    tooltip.appendChild(posterFooter);
}

function hideTooltip(){
    document.querySelector('.img-padding.left').style.width = 0;
    document.querySelector('.img-padding.right').style.width = 0;
    document.querySelector('.img-padding.top').style.height = 0;
    document.querySelector('.img-padding.bottom').style.height = 0;            
    tooltip.style.opacity = 0;
 
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

function createSprite(currResource, x, y){
    const sprite = new PIXI.Sprite(currResource.texture);
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

  

    sprite.on('click', (d)=> {
        viewport.animate({
            time: 300,
            scale: viewport.screenWidth/(2.2*unitSize),
            position: {x: spriteX ,y: spriteY}
        })

        setTimeout(function() {
            hitArea = viewport.hitArea;
            let xPadding =  ( 100*(1-(unitSize/hitArea.width))/2 ) + '%';
            let yPadding =  ( 100*(1-(unitSize/hitArea.height))/2 ) + '%';   
            hideAdjacentImages(xPadding, yPadding);
        }, 300)
        
        populateTooltip(posterAttr[currResource.name])        
    })
    sprite.on('mouseover', (d)=> {
        document.querySelector("canvas").style.cursor = "pointer";
    });
    sprite.on('mouseout', (d)=>{
        document.querySelector("canvas").style.cursor = "inherit";
    })
    return sprite;
}

function updateSpriteRes(){
    let hitArea = viewport.hitArea;
    let filterSprites = spriteHolder.filter(d=> {
        return d.x >= hitArea.x && d.x <= (hitArea.x+hitArea.width) && d.y >= hitArea.y && d.y <= (hitArea.y+hitArea.height)
    });
    if (filterSprites.length < 10){
        filterSprites.forEach( d => {
            //BAD CODE
            if (d.texture.textureCacheIds.length > 1){
                let highResTexture = './poster-assets/' + d.texture.textureCacheIds[0] + '.jpg';
                let textId = d.texture.textureCacheIds[0];
                highResText = PIXI.Texture.from(highResTexture);
                d.texture = highResText;    
            }
         
        });           
    }
    return filterSprites;
}