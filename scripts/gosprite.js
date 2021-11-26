class SpriteFrame 
{
    constructor (width, height, space){
        this.width = width;
        this.height = height;
        this.space = space;
    }
}

class SpriteSource {
    constructor (src, index){
        
        //console.log(src + " : " + index);
        this.src = src;
        this.index = index;
    }

    static Load (data)
    {
        return new SpriteSource(data.src, data.id);
    }
}

class GOSprite
{
    constructor (spriteFrame, spriteSource){
        this.spriteFrame = spriteFrame;  
        this.readyDraw = false;
        this.x = 0;
        this.y = 0;
        this.index = spriteSource.index;
        this.spriteSheet = null;
        RPGManager.SpriteSheet(spriteSource.src, spriteSheet =>
        {
            this.spriteSheet = spriteSheet;
            this.maxColum = Math.ceil(this.spriteSheet.width / (this.spriteFrame.width));
            console.log(this.spriteSheet.width + " " + this.maxColum + " " + this.x + " " + this.y);
            this.x = this.index % this.maxColum;
            this.y = (this.index - this.x) / this.maxColum;
            this.readyDraw = true;
        });
    }

    draw(context, posX, posY, size) {
        if(this.readyDraw)
        {
            let hsize = size / 2;
            posX = posX - hsize;
            posY = posY - hsize;
            let fw = this.spriteFrame.width;
            let fh = this.spriteFrame.height;
            let fs = this.spriteFrame.space;

            let fx = (fw * this.x);
            let fy = (fh * this.y);

            context.drawImage(
                this.spriteSheet,
                fx,
                fy,
                fw,
                fh,
                posX, 
                posY,
                size,
                size
            );
        }
    }
    
}

class AnimatedSprite extends GOSprite
{ 
    constructor (spriteFrame, spriteSource){
        super(spriteFrame, spriteSource);
        this.animation = 0;
        this.frame = 0;
        this.frameReal = 0;
        this.playing = 0;
        //console.log(spriteSource);
    }

    draw(context, posX, posY, size) {
        let hsize = size / 2;
        posX = posX - hsize;
        posY = posY - size;

        if(this.readyDraw)
        {
            let fw = this.spriteFrame.width;
            let fh = this.spriteFrame.height;
            let fs = this.spriteFrame.space;
            if(this.playing)
            {
                this.frameReal++;
                if(this.frameReal > 10) 
                {
                    this.frameReal=0;
                    this.frame += 1;
                    if(this.frame >= 3) this.frame = 0;
                }
            } else {
                this.frame = 0;
            }

            let frameIndex = this.index + this.animation + (this.frame*this.maxColum);
            let x = frameIndex % this.maxColum, y = (frameIndex - x) / this.maxColum;
            let fx = (fw * x);
            let fy = (fh * y);

            //console.log(maxColum + " = (" + x + " , " + y + ") = (" + fx + " , " + fy + ")");

            context.drawImage(
                this.spriteSheet,
                fx,
                fy,
                fw,
                fh,
                posX, 
                posY,
                size,
                size
            );
        }
    }
    
}