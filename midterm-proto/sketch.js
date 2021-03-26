
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
    var blockid =this.getAttribute('id');
    var nbrs = imgNbrs[blockid];
    document.querySelector('.block-container').innerHTML = '';

    console.log(this.getAttribute('id'), nbrs)

    nbrs.forEach(d=> {
        nbrObj = imgMeta[d];
        loadBlock(nbrObj)
    })
    
}

//show top 12 blocks

// function loadBlock(img){

//     let block = document.createElement('div');
//     block.className = 'block';
//     block.id = img.id;

//     let blockImg = document.createElement('div');
//     blockImg.className = 'block-image'

//     let blockLabel = document.createElement('div');
//     blockLabel.className = 'block-label';
//     blockLabel.innerText = img.title;

//     var imgObj = new Image();                             
//     imgObj.src = img.file;

//     imgObj.addEventListener("load", function(){

//         blockImg.appendChild(this);
//         block.appendChild(blockImg);
//         block.appendChild(blockLabel);
//         document.querySelector('.block-container').appendChild(block);
//         block.addEventListener('click', eventBlockClick)
//     });
// }


function initBlocks(){


    var imgMetaArray = Object.keys(imgMeta).map((key) => [Number(key), imgMeta[key]]);

    var blockCont = d3.select('.block-container');
    var blocks = blockCont.selectAll('.block').data(imgMetaArray, d => d[0]).join('div').attr('class', 'block');
    blocks.append('img').attr('class', 'block-image').attr('src', d=> d[1].file);
    blocks.append('div').attr('class', 'block-label').text(d=> d[1].title);
    blocks.
    

    d3.select('.filter-btn').on('click', d=>{
        shuffleBlocks();
    });

}


function displayNeighbors(){
    console.log('n time')
}

function shuffleBlocks(){
    console.log('shuffling')
}