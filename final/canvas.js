
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
    posterArray = posterArray.sort((a,b)=> a[1].GridOrder - b[1].GridOrder);
    //posterArray = posterArray.slice(0, 500);
    return posterArray;
}

async function loadPosters(){
    const numImgs = posterArray.length;
    posterArray.forEach(d => {
        var fileName = './poster-assets-thumb-small/' + d[0] + '.jpg';
        app.loader.add(d[0], fileName)
    });
    
    //ADD IMAGES TO PIXI
    
    const vw = viewport.worldWidth;
    const vh = viewport.worldHeight;
    const ar = vw/vh;
    unitSize = Math.floor( Math.sqrt((vw*vh/(numImgs))) );
    const numUnits = vw*vh/(unitSize*unitSize);
    const unitBasis = Math.sqrt(numUnits/(ar));
    //fix to make responsive for tall screens
    const xUnits = Math.ceil(unitBasis*ar), yUnits = Math.ceil(unitBasis);
    const aspectRatio = viewport.worldWidth/viewport.worldHeight;
    let container = new PIXI.Container();
    var spriteDict = {};
    
    app.loader.load((loader, resources)=> {
        const resourceArray = Object.values(resources);
        let rIndex = 0;
        for (var y=0; y<yUnits; y++){
            for (var x=0; x<xUnits; x++){
                if (rIndex < resourceArray.length-1){
                    let currResource = resourceArray[rIndex];
                    const sprite = createSprite(currResource, x, y);
                    container.addChild(sprite);
                    spriteHolder.push(sprite);
                    spriteDict[currResource.name] = spriteHolder.length-1;
                    rIndex++
                } else {
                    break;
                }
           
            }
        }
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
        if (e.transform.localTransform.a > lastScale){
            updateSpriteRes();
        } 
        else {
            hideTooltip();
        }
        lastScale = e.transform.localTransform.a;
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



