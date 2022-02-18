import { RPGManager } from "./scripts/rpgmanager.js";

const canvas = document.querySelector("canvas");

const rpgmanager = new RPGManager (canvas);

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
    
    tgt.transform.positionX = e.clientX-(rpgmanager.canvas.width/2)+offsetX;
    tgt.transform.positionY = e.clientY-(rpgmanager.canvas.height/2)+offsetY;
}
    
rpgmanager.LoadCharacters ("personagens.json");
//rpgmanager.LoadMap ("mapa1.json", "tilesheet1.json");

gameloop();
window.addEventListener("click", mouseClick, false);