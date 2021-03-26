
var imgMetaArray = Object.keys(imgMeta).map((key) => [Number(key), imgMeta[key]]);

window.addEventListener("load", function(){
    
    for (var key in imgMeta) { //clean data and delete objects that have no nbrs
        if (!imgNbrs[key]){
            delete imgMeta[key] 
        }  else {
            currVal = imgMeta[key];
            currVal.file = './imgs/' + key + '.jpg';
            currVal.id = key;
        }
    }

    initBlocks();

 
});


function eventBlockClick(d){

    var blockid = d3.select(this).data()[0][0];
    var nbrs = imgNbrs[blockid.toString()];
    console.log(nbrs)
    var currData = imgMetaArray.filter(d=> nbrs.includes(d[0].toString()))
    plotBlocks(currData);
    
}

function initBlocks(){
    plotBlocks(imgMetaArray)
}


function plotBlocks(data){
    var blockCont = d3.select('.block-container');
    var blocks = blockCont.selectAll('.block').data(data, d=>d[0]).join(
        enter => {
            var b = enter.append('div').attr('class', 'block');
            b.append('img').attr('class', 'block-image').attr('src', d=> d[1].file);
            b.append('div').attr('class', 'block-label').text(d=> d[1].title);
        }
    ).attr('class', 'block');

    blockCont.selectAll('.block').on('click', eventBlockClick)
    
    d3.select('.filter-btn').on('click', d=>{
        shuffleBlocks();
    });
}





function displayNeighbors(){
    console.log('n time')
}

function shuffleBlocks(){
   plotBlocks(imgMetaArray);
}