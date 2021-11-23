class Objeto 
{
    constructor (posX, posY){
        this.positionX = posX;
        this.positionY = posY;
    }
}

class GameObjeto extends Objeto
{
    constructor (sprite, posX, posY, s, rot)
    {
        super(posX, posY);
        this.size = s;
        this.sprite = sprite;
        this.rotation = rot;
    }

    static defaultFrame = new SpriteFrame(16,16,1);

    draw(canvas, context) {
        let hsize = this.size / 2;
        let cx = this.positionX + (canvas.width/2), cy = this.positionY + (canvas.height/2); //hsize
        //console.log("Drawing GO");
        context.translate(cx, cy);
        context.rotate((Math.PI / 180) * this.rotation);     
        context.translate(-cx, -cy);
        this.sprite.draw(context, cx, cy, this.size);
        context.translate(cx, cy);
        context.rotate((Math.PI / 180) * -this.rotation);
        context.translate(-cx, -cy); 
    }
}

class PhysicObjeto extends GameObjeto 
{
    constructor (sprite, positionX, positionY, size, rotation, isTrigger)
    {
        super(sprite, positionX, positionY, size, rotation);
        this.colliding = false;
        this.collisions = [];
        this.isTrigger = isTrigger;
    }

    collision (other){
        if(!this.isTrigger && (this.positionX + this.size > other.positionX 
            && this.positionX < other.positionX + other.size 
            && this.positionY + this.size > other.positionY 
            && this.positionY < other.positionY + other.size))
        {
            this.colliding = true;
            other.colliding = false;
            //console.log(this + " colidiu " + other);
        } else {
            other.colliding = false;
            this.colliding = false;
        }
        
    }
}

class DynamicObjeto extends PhysicObjeto 
{
    constructor (sprite, positionX, positionY, size, rotation, isTrigger, speedRotation, speed)
    {
        super(sprite, positionX, positionY, size, rotation, isTrigger);

        this.speedRot = speedRotation;
        this.speed = speed;
        this.directionX = 0;
        this.directionY = 0;
    }

    update()
    {
        let velX = this.directionX*this.speed, velY = this.directionY*this.speed;
        if(this.colliding)
        {
            velX = -velX;
            velY = -velY;
        }

        let vXmod = Math.abs(velX);
        let vYmod = Math.abs(velY);

        if(vXmod + vYmod == 0){
            this.sprite.playing = false;
        } else {
            if(vXmod <= vYmod) 
            {
                if(velY > 0) {
                    this.sprite.animation = 1;
                }
                else if(velY < 0) {
                    this.sprite.animation = 2;
                }
            } 
            else if(vXmod > vYmod) 
            {
                if(velX > 0) {
                    this.sprite.animation = 3;
                }
                else if(velX < 0) {
                    this.sprite.animation = 0;
                }
            }
            this.sprite.playing = true;
        }
        
        this.positionX += velX;
        this.positionY += velY;
    }
}

class Character extends DynamicObjeto 
{
    constructor (sprite, positionX, positionY, size, rotation, isTrigger, speedRotation, speed)
    {
        super(sprite, positionX, positionY, size, rotation, isTrigger, speedRotation, speed);
    }

    static Load (data)
    {
        let sp = SpriteSource.Load(data.spriteSource);
        
        let anim = new AnimatedSprite(super.defaultFrame, sp);
        
        console.log(anim);

        return new Character(anim, data.positionX, data.positionY, data.size, data.rotation, data.isTrigger, data.speedRotation, data.speed);
    }
}

class Tile extends Objeto
{
    constructor (posX, posY, type)
    {
        super(posX, posY);
        this.type = type;
    }

    static Load (data)
    {
        return new Tile(data.type, data.positionX, data.positionY);
    }
}

class TilePrefab
{
    constructor (spriteSource, size, block)
    {
        this.sprite = new GOSprite(defaultFrame, spriteSource);
        this.size = size;
        this.block = block;
    }

    static defaultFrame = new SpriteFrame(16,16,1);

    static Load (data)
    {
        return new Tile(SpriteSource.Load(data.spriteSource), data.positionX, data.positionY);
    }
}