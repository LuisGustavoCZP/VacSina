import { Objeto, GameObjeto, PhysicObjeto, DynamicObjeto, Character, Tile, TilePrefab, TileMap } from "./rpgobjetos.js";

export class RPGManager 
{
    static spritesSheets = [];
    static SpriteSheet(path, onload) {
        
        if(this.spriteSheets != undefined)
        {
            if(this.spriteSheets[path] != undefined)
            {
                onload(this.spriteSheets[path]);
            }
        } 
        else 
        {
            this.spriteSheets = [];
        }

        const spriteSheet = new Image();
        this.spriteSheets[path] = spriteSheet;
        this.spriteSheets.length++;
        spriteSheet.onload = x => {
            onload(x.path[0]);
        };
        spriteSheet.src = path;
    }       

    constructor (canvas){
        this.canvas = canvas;
        this.context2D = canvas.getContext("2d");
        this.gameObjetos = [];
        this.maps = [];
        this.jogador = 0;
       
        this.iaTargets = [];
    }
    dataPath = "../data/";
    LoadCharacters (path) {
        LoadJSON (this.dataPath+path, data =>
        {
            for(let i = 0; i < data.length; i++)
            {
                const obj = Character.Load(data[i]);
                console.log(obj);
                this.gameObjetos.push(obj);
            }
        });
    }

    LoadMap (mappath, spritesheetpath) {
        if(this.maps == undefined) this.maps = [];
        LoadJSON (this.dataPath + mappath, mapdata =>
        {
            LoadJSON (this.dataPath + spritesheetpath, spritesheetdata =>
            {
                const m = TileMap.Load(mapdata, spritesheetdata);
                this.maps.push(m);
                console.log(m);
            });
        });
    }

    updateIAControls()
    {
        for(let i = 0; i < this.gameObjetos.length; i++){
            
            if(!(this.gameObjetos[i] instanceof DynamicObjeto)){
                if(this.iaTargets.length <= i){
                    this.iaTargets.push(null);
                }
                continue;
            } else if (!this.iaTargets.hasOwnProperty(i)) {
                this.iaTargets[i] = new Objeto({positionX: 0, positionY: 0});
            }

            const gameObjeto = this.gameObjetos[i];
            const tgt = this.iaTargets[i];
            if(tgt == null){
                continue;
            }

            let dirX = tgt.transform.positionX - gameObjeto.transform.positionX;
            let dirY = tgt.transform.positionY - gameObjeto.transform.positionY;
            const maxDist = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));
            if(maxDist < gameObjeto.dynamic.speed) {
                if(i == this.jogador){
                    gameObjeto.dynamic.directionX = 0;
                    gameObjeto.dynamic.directionY = 0;
                    continue;
                }
                else
                {
                    tgt.transform.positionX = (Math.random()-.5)*this.canvas.width;
                    tgt.transform.positionY = (Math.random()-.5)*this.canvas.height;
                }
            }

            dirX = maxDist > 0 ? dirX / maxDist : 0;
            dirY = maxDist > 0 ? dirY / maxDist : 0;
            gameObjeto.dynamic.directionX = dirX;
            gameObjeto.dynamic.directionY = dirY;
        }
    }

    updatePlayerControls(){
        const gameObjeto = this.gameObjetos[this.jogador];
        if(this.mvLeft){
            gameObjeto.dynamic.directionX = -1;
        } else
        if(this.mvRight){
            gameObjeto.dynamic.directionX = +1;
        } else {
            gameObjeto.dynamic.directionX = 0;
        }
        if(this.mvUp){
            gameObjeto.dynamic.directionY = 1;
        } else
        if(this.mvDown){
            gameObjeto.dynamic.directionY = -1;
        } else {
            gameObjeto.dynamic.directionY = 0;
        }
    }

    keyUpHandler (e){
        const key = e.keyCode;
        if(key == this.LEFT) this.mvLeft = false;
        if(key == this.RIGHT) this.mvRight = false;
        if(key == this.UP) this.mvUp = false;
        if(key == this.DOWN) this.mvDown = false;

    }

    keyDownHandler (e){
        const key = e.keyCode;
        if(key == this.LEFT) this.mvLeft = true;
        if(key == this.RIGHT) this.mvRight = true;
        if(key == this.UP) this.mvUp = true;
        if(key == this.DOWN) this.mvDown = true;

    }

    gameupdate (){
        for(let i = 0; i < this.gameObjetos.length; i++){
            const gameObjeto = this.gameObjetos[i];
            
            if(gameObjeto instanceof DynamicObjeto){
                gameObjeto.update();
            }

            if(gameObjeto instanceof PhysicObjeto){
                for(let j = 0; j < this.gameObjetos.length; j++)
                {
                    if(i == j) continue;
                    gameObjeto.collision(this.gameObjetos[j]);
                }
            }
        }
    }

    gamedraw (){
        this.context2D.clearRect(0,0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.maps.length; i++){
            this.maps[i].draw(this.canvas, this.context2D);
        }

        for(let i = 0; i < this.gameObjetos.length; i++){
            this.gameObjetos[i].draw(this.canvas, this.context2D);
        }
    }

    gameloop ()
    {
        this.updateIAControls();
        this.gameupdate();
        this.gamedraw();
    }
}