// INIT PIXI

let app, viewport;
let unitSize;
var spriteHolder = [];
let spriteDict = {};
async function initApp(){
    await initPixi();
    showLoadProgress();
    initHeaderAndZoom();
    await initData();
    await loadPosters();
    
}
initApp();


//change to be more explicit, functions get exactly what they need
