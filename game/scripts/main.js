var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var rpgmanager = new RPGManager (canvas, ctx);

function gameloop ()
{
    window.requestAnimationFrame(gameloop, canvas);
    rpgmanager.gameloop();
}

function mouseClick (e){
    let iat = rpgmanager.iaTargets;
    let tgt = iat[rpgmanager.jogador];
    let pos = rpgmanager.canvas.getBoundingClientRect();
    let offsetX = - pos.left;
    let offsetY = - pos.top;
    
    tgt.positionX = e.clientX-(rpgmanager.canvas.width/2)+offsetX;
    tgt.positionY = e.clientY-(rpgmanager.canvas.height/2)+offsetY;
}


rpgmanager.LoadCharacters ("data/personagens.json");
rpgmanager.LoadMap ("data/mapa1.json", "data/tilesheet1.json");

gameloop();
window.addEventListener("click", mouseClick, false);