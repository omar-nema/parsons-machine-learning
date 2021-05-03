
async function initPixi(){
    const pixiCanvasW = window.innerWidth-100;
    const pixiCanvasH = window.innerHeight-80;
    app = new PIXI.Application({width: pixiCanvasW, height: pixiCanvasH, transparent: true});
    document.body.appendChild(app.view);
    viewport = new Viewport.Viewport({
        screenWidth: pixiCanvasW,
        screenHeight: pixiCanvasH,
        worldWidth: pixiCanvasW,
        worldHeight: pixiCanvasH,
        interaction: app.renderer.plugins.interaction,
    });
    app.stage.addChild(viewport);
    viewport.drag().pinch().decelerate()
        .clamp({direction: 'all'})
        .clampZoom({minScale: 1});
    viewport.wheel({ smooth: 10});
    return [app, viewport]
}

let posterArray;
async function initData(){
    posterArray = Object.entries(posterAttr);
    posterArray = posterArray.sort((a,b)=> a[1].GridPosX - b[1].GridPosX);
    posterArray = posterArray.sort((a,b)=> a[1].GridPosY - b[1].GridPosY);
    posterArray = posterArray.slice(0, 1000);
    return posterArray;
}

async function loadPosters(){
    const numImgs = posterArray.length;
    posterArray.forEach(d => {
        var fileName = './poster-assets-thumb-small/' + d[0] + '.jpg';
        app.loader.add(d[0], fileName)
    });
    
    //ADD IMAGES TO PIXI
    
    let container = new PIXI.Container();
    const xUnits = posterArray.reduce((a,b, index)=> {
        if (index == 1){
            return Math.max(a[1].GridPosX, b[1].GridPosX);
        } else {
            return Math.max(a, b[1].GridPosX);
        }
    });
    const yUnits = posterArray.reduce((a,b, index)=> {
        if (index == 1){
            return Math.max(a[1].GridPosY, b[1].GridPosY);
        } else {
            return Math.max(a, b[1].GridPosY);
        }
    });

    const gridLargeDim = Math.max(xUnits, yUnits);
    const viewSmallDim = Math.min(viewport.worldWidth, viewport.worldHeight);
    // unitSize = Math.sqrt((viewSmallDim*viewSmallDim)/(gridLargeDim*gridLargeDim));
    // console.log(unitSize)
    unitSize = Math.sqrt((viewSmallDim*viewport.worldHeight)/(xUnits*yUnits));
  

    //make sure it's centered
    const viewOffsetX = (viewport.worldWidth-(unitSize*xUnits))/2;
    const viewOffsetY = (viewport.worldHeight-(unitSize*yUnits))/2;
   
    app.loader.load((loader, resources)=> {
        const resourceArray = Object.values(resources);
        let rIndex = 0;

        resourceArray.forEach(r => {
            let metadata = posterAttr[r.name];
            let x = metadata.GridPosX * unitSize + viewOffsetX;
            let y = metadata.GridPosY * unitSize + viewOffsetY;          
            const sprite = createSprite(r, x, y);
            container.addChild(sprite);
            spriteHolder.push(sprite);
            spriteDict[r.name] = spriteHolder.length-1;
        })

        viewport.addChild(container);
    });
    return [spriteDict, spriteHolder]
}

function initHeaderAndZoom(){
    function showInfo(){
        document.querySelector('.header-info').classList.toggle('show');
    }
    document.querySelector('.header-large').addEventListener('click', showInfo);
    document.querySelector('.header-info-footer').addEventListener('click', showInfo);
    document.querySelector('.btn-shuffle').addEventListener('click', ()=>{
        let randomSprite = spriteHolder[Math.floor(Math.random() * spriteHolder.length)];
        zoomIntoSprite(randomSprite);
    })
    document.querySelector('.btn-zoom-in').addEventListener('click', ()=>{
        viewport.animate({
            time: 300,
            scale: 2*viewport.lastViewport.scaleX
        });
    })
    document.querySelector('.btn-zoom-out').addEventListener('click', ()=>{
        viewport.animate({
            time: 300,
            scale: .5*viewport.lastViewport.scaleX
        });
    })
    //UPDATE ON ZOOM
    var lastScale = 1;
    viewport.on('zoomed-end', (e) => {
        //if zoomedIn
        if (e.transform.localTransform.a >= lastScale){
            updateSpriteRes();
        } 
        else {
            hideTooltip();
        }
        lastScale = e.transform.localTransform.a;
    });
    //performance issues with this?
    const tooltip = document.querySelector('#poster-tooltip');
    viewport.on('zoomed', (e) => {
        if (viewport.transform.localTransform.a >= lastScale){
            updateSpriteRes();
        } else if (!tooltip.classList.contains('hidden')){
            hideTooltip();
        }
        lastScale = viewport.transform.localTransform.a;
    });
    viewport.on('moved-end', (e)=>{
        updateSpriteRes();
    })


}

function showLoadProgress(){
    let progress = document.querySelector('#progress');
    app.loader.onProgress.add((e) => {
        progress.innerText = 'Loading ' + Math.round(e.progress.toString()) + '%'
    }); 
    app.loader.onComplete.add(() => {
        progress.innerText = 'Explore Posters';
        loadBtn.className = 'load-btn enabled';
    }); // called once when the queued resources all load.
    let loadBtn = document.querySelector('#load-overlay .load-btn');
    loadBtn.addEventListener('click', function(){
        document.querySelector('#load-overlay').className = 'done';
    });

}

function getRelativeSprite(key, relativeIndex){
    let spriteIndex = spriteDict[key];
    return spriteHolder[spriteIndex+relativeIndex];
}



