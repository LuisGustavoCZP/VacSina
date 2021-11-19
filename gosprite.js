class SpriteFrame 
{
    constructor (width, height, space){
        this.width = width;
        this.height = height;
        this.space = space;
    }
    width;
    height;
    space;
}

class GOSprite 
{ 
    constructor (spriteFrame, source, id){
        this.spriteFrame = spriteFrame;
        this.spriteSheet = new Image();
        this.readyDraw = false;
        this.width = 0;
        this.height = 0;
        this.spriteSheet.onload = () => 
        {
            let maxColum = Math.ceil(this.spriteSheet.width / (this.spriteFrame.width));
            this.width = this.index % maxColum;
            this.height = (this.index - this.width) / maxColum;
            this.readyDraw = true;
        }
        this.spriteSheet.onloadstart = () => 
        {
            this.readyDraw = false;
        }
        this.spriteSheet.src = source;
        this.index = id;
    }
    spriteFrame;
    spriteSheet;
    width;
    height;
    index;
    readyDraw;

    draw(context, posX, posY, size) {
        let hsize = size / 2;
        posX = posX - hsize;
        posY = posY - hsize;
        let fw = this.spriteFrame.width;
        let fh = this.spriteFrame.height;
        let fs = this.spriteFrame.space;

        if(this.readyDraw)
        {
            let fx = (fw * this.width);
            let fy = (fh * this.height);

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
    constructor (spriteFrame, source, id){
        super(spriteFrame, source, id);
        this.animation = 0;
        this.frame = 0;
        this.frameReal = 0;
    }
    animation;
    frame;
    frameReal;

    draw(context, posX, posY, size) {
        let hsize = size / 2;
        posX = posX - hsize;
        posY = posY - hsize;

        if(this.readyDraw)
        {
            let fw = this.spriteFrame.width;
            let fh = this.spriteFrame.height;
            let fs = this.spriteFrame.space;
            let maxColum = Math.ceil(this.spriteSheet.width / (fw));
            this.frameReal++;
            if(this.frameReal > 10) 
            {
                this.frameReal=0;
                this.frame += 1;
                if(this.frame >= 3) this.frame = 0;
            }
            let frameIndex = this.index + this.animation + (this.frame*maxColum);
            let x = frameIndex % maxColum, y = (frameIndex - x) / maxColum;
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