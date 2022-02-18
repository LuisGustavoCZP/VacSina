import { RPGManager } from "./rpgmanager.js";

export class SpriteFrame 
{
    constructor (width, height, space){
        this.width = width;
        this.height = height;
        this.space = space;
    }
}

export class GOSprite
{
    constructor (spriteFrame, spriteSource, index)
    {
        this.spriteFrame = spriteFrame;  
        this.readyDraw = false;
        this.x = 0;
        this.y = 0;
        this.index = index;
        this.spriteSheet = null;
        RPGManager.SpriteSheet(spriteSource, spriteSheet =>
        {
            this.spriteSheet = spriteSheet;
            const fs = this.spriteFrame.space;
            const nw = this.spriteFrame.width + fs, nh = this.spriteFrame.height + fs;
            this.maxColumX = Math.ceil((this.spriteSheet.width + fs) / (nw));
            this.maxColumY = Math.ceil((this.spriteSheet.height + fs) / (nh));
            console.log(`${this.spriteSheet.width} => [${this.maxColumX}, ${this.maxColumY}] => (${this.x}, ${this.y})`);
            this.x = this.index % this.maxColumX;
            this.y = (this.index - this.x) / this.maxColumY;
            this.readyDraw = true;
        });
    }

    draw(context, posX, posY, size) {
        if(this.readyDraw)
        {
            const w = this.spriteFrame.width*size, h = this.spriteFrame.height*size;
            posX = posX - (w/2);
            posY = posY - (h/2);///2
            const fw = this.spriteFrame.width;
            const fh = this.spriteFrame.height;
            const fs = this.spriteFrame.space;

            const fx = ((fw + fs) * this.x);
            const fy = ((fh + fs) * this.y);

            context.drawImage(
                this.spriteSheet,
                fx,
                fy,
                fw,
                fh,
                posX, 
                posY,
                w,
                h
            );
        }
    }
    
}

export class AnimatedSprite extends GOSprite
{ 
    constructor (spriteFrame, spriteSource, anim, index){
        super(spriteFrame, spriteSource, index);
        this.animation = 0;
        this.frame = 0;
        this.frameReal = 0;
        this.playing = "idle";
        this.anim = anim;
        //console.log(spriteSource);
    }

    draw(context, posX, posY, size) {
        const w = this.spriteFrame.width*size, h = this.spriteFrame.height*size;
        posX = posX - (w/2);
        posY = posY - (3*h/4);

        if(this.readyDraw)
        {
            const fs = this.spriteFrame.space;
            const fw = this.spriteFrame.width + fs;
            const fh = this.spriteFrame.height + fs;
            let sequence;
            if(this.playing && this.playing != "")
            {
                sequence = this.anim.sequences[this.playing];
                this.frameReal++;
                if(this.frameReal > 10) 
                {
                    this.frameReal=0;
                    this.frame += 1;
                    if(this.frame >= sequence.length) this.frame = 0;
                }
            } else {
                this.frame = 0;
                sequence = this.anim.sequences["idle"];
            }

            const frameIndex = this.index + (this.anim.vertical ? sequence[this.frame] + (this.animation*this.maxColumX) : this.animation + (sequence[this.frame]*this.maxColumX));
            const x = frameIndex % this.maxColumX, y = (frameIndex - x) / this.maxColumX;
            const fx = (fw * x);
            const fy = (fh * y);

            context.drawImage(
                this.spriteSheet,
                fx,
                fy,
                fw,
                fh,
                posX, 
                posY,
                w,
                h
            );
        }
    }
    
}