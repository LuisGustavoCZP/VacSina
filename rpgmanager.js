class RPGManager 
{
    constructor (canvas, ctx, gameObjetos, tiles){
        this.canvas = canvas;
        this.context2D = ctx;
        this.tiles = tiles;
        this.gameObjetos = gameObjetos;
        this.jogador = 0;
        this.iaTargets = [];
        for(let i = 0; i < gameObjetos.length; i++){
            this.iaTargets.push(new Objeto(0,0));
        }
    }

    canvas;
    context2D;
    tiles;
    gameObjetos;
    jogador;    
    iaTargets;

    //window.addEventListener("keydown", keyDownHandler, false)
    //window.addEventListener("keyup", keyUpHandler, false)

    updateIAControls()
    {
        for(let i = 0; i < this.gameObjetos.length; i++){
            
            if(!(this.gameObjetos[i] instanceof DynamicObjeto)){
                if(this.iaTargets.length <= i){
                    this.iaTargets.push(null);
                }
                continue;
            }

            let gameObjeto = this.gameObjetos[i];
            let tgt = this.iaTargets[i];

            let dirX = tgt.positionX - gameObjeto.positionX;
            let dirY = tgt.positionY - gameObjeto.positionY;
            let maxDist = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));
            if(maxDist < gameObjeto.speed) {
                if(i == this.jogador){
                    //tgt.positionX = gameObjeto.positionX;
                    //tgt.positionY = gameObjeto.positionY;
                }
                else
                {
                    tgt.positionX = (Math.random()-.5)*this.canvas.width;
                    tgt.positionY = (Math.random()-.5)*this.canvas.height;
                }
                continue;
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
                for(let j = 0; j < this.tiles.length; j++)
                {
                    if(i == j) continue;
                    gameObjeto.collision(this.tiles[j]);
                }
            }
        }
    }

    gamedraw (){
        this.context2D.clearRect(0,0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.tiles.length; i++){
            this.tiles[i].draw(this.canvas, this.context2D);
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