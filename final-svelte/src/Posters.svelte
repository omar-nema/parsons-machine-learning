

<style>

</style>

<script>

    import * as PIXI from 'pixi.js'
    import { Viewport } from 'pixi-viewport'

    import * as pc from './posterAttrClean.json' 

    let posterAttr = pc.default;

    const pixiCanvasW = window.innerWidth-100;
    const pixiCanvasH = window.innerHeight-80;

    //creates renderer with webgl, and adds canvas
    const app = new PIXI.Application({width: pixiCanvasW, height: pixiCanvasH, transparent: true});
    document.body.appendChild(app.view);

    //from sep. library, insert viewport to stage
    const viewport = new Viewport({
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

    let posterArray = Object.entries(posterAttr);
    posterArray = posterArray.sort((a,b)=> a[1].GridOrder - b[1].GridOrder);

    //FOR TESTING
    posterArray = posterArray.slice(0, 20)
    const numImgs = posterArray.length;

    posterArray.forEach(d => {
        var fileName = '././poster-assets-thumb/' + d[0] + '.jpg';
        app.loader.add(d[0], fileName)
    })

    console.log('uh')


    const padding = 1;
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

    function createSprite(currResource, x, y){
        const sprite = new PIXI.Sprite(currResource.texture);
        sprite.x = x*unitSize;
        sprite.y = y*unitSize; 
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        let scaleRatio = unitSize/Math.max(sprite.width, sprite.height)
        sprite.width = sprite.width*scaleRatio;
        sprite.height = sprite.height*scaleRatio;
        sprite.interactive = true;
        return sprite;
    }

    app.loader.load((loader, resources)=> {


        // const sprites = [];
        const resourceArray = Object.values(resources);
        let rIndex = 0;
        for (var y=0; y<yUnits; y++){
            for (var x=0; x<xUnits; x++){
                if (rIndex < resourceArray.length-1){
                    let currResource = resourceArray[rIndex];
                    const sprite = createSprite(currResource, x, y);
                    container.addChild(sprite);
                    sprite.on('click', (d)=> {
                        posterObj = posterAttr[currResource.name];
                        
                    })
                    rIndex++
                } else {
                    break;
                }
        
            }

        }

        // sprites.forEach(d=> {
        //     container.addChild(d);
        //     //viewport.addChild(d)
        // })
        // console.log(container)
        viewport.addChild(container);
    })


</script>




