class RPGManager 
{
    static spritesSheets = [];
    static SpriteSheet(path, onload) {
        
        if(this.spriteSheets != undefined)
        {
            if(this.spriteSheets[path] != undefined)
            {
                onload(this.spriteSheets[path]);
            }
        } else {
            this.spriteSheets = [];
        }

        let spriteSheet = new Image();
        this.spriteSheets[path] = spriteSheet;
        this.spriteSheets.length++;
        spriteSheet.onload = x => {
            onload(x.path[0]);
        };
        spriteSheet.src = path;
    }

    constructor (canvas, ctx){
        this.canvas = canvas;
        this.context2D = ctx;
        this.gameObjetos = [];
        this.maps = [];
        this.jogador = 0;
       
        this.iaTargets = [];
    }

    LoadCharacters (path) {
        LoadJSON (path, data =>
        {
            for(let i = 0; i < data.length; i++){
                let obj = Character.Load(data[i]);
                this.gameObjetos.push(obj);
            }
        });
    }

    LoadMap (mappath, spritesheetpath) {
        if(this.maps == undefined) this.maps = [];
        LoadJSON (mappath, mapdata =>
        {
            LoadJSON (spritesheetpath, spritesheetdata =>
            {
                let m = TileMap.Load(mapdata, spritesheetdata);
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
                this.iaTargets[i] = new Objeto(0,0);
            }

            let gameObjeto = this.gameObjetos[i];
            let tgt = this.iaTargets[i];
            if(tgt == null){
                continue;
            }

            let dirX = tgt.positionX - gameObjeto.positionX;
            let dirY = tgt.positionY - gameObjeto.positionY;
            let maxDist = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));
            if(maxDist < gameObjeto.speed) {
                if(i == this.jogador){
                    //tgt.positionX = gameObjeto.positionX;
                    //tgt.positionY = gameObjeto.positionY;
                    gameObjeto.directionX = 0;
                    gameObjeto.directionY = 0;
                    continue;
                }
                else
                {
                    tgt.positionX = (Math.random()-.5)*this.canvas.width;
                    tgt.positionY = (Math.random()-.5)*this.canvas.height;
                }
            }

            dirX = maxDist > 0 ? dirX / maxDist : 0;
            dirY = maxDist > 0 ? dirY / maxDist : 0;
            //let rad = ((360-gameObjeto.rotation+90)*Math.PI)/180;
            //let sin = Math.sin(rad), cos = Math.cos(rad);

            //let odirX = (sin != 0? (sin)*dirX : 0) + (cos != 0? (cos)*dirY : 0);
            //let odirY = (cos != 0? (cos)*dirX : 0) + (sin != 0? (sin)*dirY : 0);

            gameObjeto.directionX = dirX;//odirX;//(1/Math.sin(rad))*dirX + (1/Math.cos(rad))*dirY;
            gameObjeto.directionY = dirY;//1 - (1/maxDist);
            //gameObjeto.directionY = Math.sin(rad)*dirX + Math.cos(rad)*dirY;//(1/Math.cos(rad))*dirX + (1/Math.sin(rad))*dirY;
            //
            
        }
    }

    updatePlayerControls(){
        let gameObjeto = this.gameObjetos[this.jogador];
        if(this.mvLeft){
            gameObjeto.directionX = -1;
        } else
        if(this.mvRight){
            gameObjeto.directionX = +1;
        } else {
            gameObjeto.directionX = 0;
        }
        if(this.mvUp){
            gameObjeto.directionY = 1;
        } else
        if(this.mvDown){
            gameObjeto.directionY = -1;
        } else {
            gameObjeto.directionY = 0;
        }
    }

    keyUpHandler (e){
        let key = e.keyCode;
        if(key == this.LEFT) this.mvLeft = false;
        if(key == this.RIGHT) this.mvRight = false;
        if(key == this.UP) this.mvUp = false;
        if(key == this.DOWN) this.mvDown = false;

    }

    keyDownHandler (e){
        let key = e.keyCode;
        if(key == this.LEFT) this.mvLeft = true;
        if(key == this.RIGHT) this.mvRight = true;
        if(key == this.UP) this.mvUp = true;
        if(key == this.DOWN) this.mvDown = true;

    }

    gameupdate (){
        for(let i = 0; i < this.gameObjetos.length; i++){
            let gameObjeto = this.gameObjetos[i];
            
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