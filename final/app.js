// INIT PIXI

let app, viewport;
var spriteHolder = [];
let spriteDict = {};

let unitSize;
async function initApp(){
    await initPixi();
    showLoadProgress();
    initHeaderAndZoom();
    await initData();
    await loadPosters();
    
}
initApp();


//change to be more explicit, functions get exactly what they need
