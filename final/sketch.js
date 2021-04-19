// INIT PIXI
const pixiCanvasW = window.innerWidth-100;
const pixiCanvasH = window.innerHeight-80;
const app = new PIXI.Application({width: pixiCanvasW, height: pixiCanvasH, transparent: true});
document.body.appendChild(app.view);
const viewport = new Viewport.Viewport({
    screenWidth: pixiCanvasW,
    screenHeight: pixiCanvasH,
    worldWidth: pixiCanvasW,
    worldHeight: pixiCanvasH,
    interaction: app.renderer.plugins.interaction,
});
app.stage.addChild(viewport);
viewport.drag().pinch().wheel().decelerate()
    .clamp({direction: 'all'})
    .clampZoom({minScale: 1});

// INIT DATA
let posterArray = Object.entries(posterAttr);
posterArray = posterArray.sort((a,b)=> a[1].GridOrder - b[1].GridOrder);
posterArray = posterArray.slice(0, 300)
const numImgs = posterArray.length;
posterArray.forEach(d => {
    var fileName = './poster-assets-thumb/' + d[0] + '.jpg';
    app.loader.add(d[0], fileName)
})


//ADD IMAGES TO PIXI
const padding = .1;
const vw = viewport.worldWidth;
const vh = viewport.worldHeight;
const ar = vw/vh;
const unitSize = Math.floor( Math.sqrt((vw*vh/(numImgs))) );
const numUnits = vw*vh/(unitSize*unitSize);
const unitBasis = Math.sqrt(numUnits/(ar));
//fix to make responsive for tall screens
const xUnits = Math.ceil(unitBasis*ar), yUnits = Math.ceil(unitBasis);
const aspectRatio = viewport.worldWidth/viewport.worldHeight;
let container = new PIXI.Container();
var spriteHolder = [];




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
                rIndex++
            } else {
                break;
            }
       
        }
    }
    viewport.addChild(container);
});

let progress = document.querySelector('#progress');
app.loader.onProgress.add((e) => {
    progress.innerText = 'Loading ' + Math.round(e.progress.toString()) + '%'
}); 

let loadBtn = document.querySelector('#load-overlay .load-btn');
loadBtn.addEventListener('click', function(){
    document.querySelector('#load-overlay').className = 'done';
});

app.loader.onComplete.add(() => {
    progress.innerText = 'Explore Posters';
    
    loadBtn.className = 'load-btn enabled';

   

}); // called once when the queued resources all load.


//UPDATE ON ZOOM
var lastScale = 1;
viewport.on('zoomed-end', (e) => {
    //if zoomedIn
    if (e.transform.localTransform.a > lastScale){
        updateSpriteRes(spriteHolder);
    } 
    else {
        hideTooltip();
    }
    lastScale = e.transform.localTransform.a;
})