const dataPath = "../data/";
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const rpgmanager = new RPGManager (canvas, ctx);

function gameloop ()
{
    window.requestAnimationFrame(gameloop, canvas);
    rpgmanager.gameloop();
}

function mouseClick (e){
    const iat = rpgmanager.iaTargets;
    const tgt = iat[rpgmanager.jogador];
    const pos = rpgmanager.canvas.getBoundingClientRect();
    const offsetX = - pos.left;
    const offsetY = - pos.top;
    
    tgt.positionX = e.clientX-(rpgmanager.canvas.width/2)+offsetX;
    tgt.positionY = e.clientY-(rpgmanager.canvas.height/2)+offsetY;
}

rpgmanager.LoadCharacters ("personagens.json");
rpgmanager.LoadMap ("mapa1.json", "tilesheet1.json");

gameloop();
window.addEventListener("click", mouseClick, false);