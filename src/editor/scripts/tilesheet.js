import { RequestSys } from "../../scripts/requestsys.js";
import { DataFile } from "./datafile.js";
/* import { DataFile } from "./datafile.js";
export */ 

class SheetFile extends DataFile 
{
    constructor (_data) {
        super(_data);
        this.src = `sheet_${_data.name}.json`;
        if(!this.img) 
        {
            const srcpath = RequestSys.URL()+"/tilesheets/"+this.data.src;
            this.img = new Image();
            this.img.onload = () => 
            {
                this.Draw();
            };
            if(this.img.src == srcpath) return;
            
            //console.log(this.src);
            this.img.src = srcpath;
        }
    }

    LoadData (_data) {
        super.LoadData(_data);
    }

    Select () 
    {
        super.Select();
        this.canvas.onclick = (evt) => {this.PaintMap(evt)};
        this.canvas.onpointerup = (evt) => {this.paintDrag = false;};
        this.canvas.onpointerdown = (evt) => {this.paintDrag = true;};
        this.canvas.onpointermove = (evt) => {this.ControlerMove(evt)};
    }

    Draw () 
    {
        super.Draw();
        const tilesheetsList = document.getElementById("tilesheets_box");
        tilesheetsList.innerHTML = ""; 
        
        console.log(this);
        const ss = this.size * this.zoom;
        const fw = this.pixels;
        const fs = this.space;
        const nw = fw + fs;
        const maxColum = Math.ceil((this.img.width + fs) / (nw));
        const maxRow = Math.ceil((this.img.height + fs) / (nw));
        this.canvas.width = maxColum * ss;
        this.canvas.height = maxRow * ss;
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.data.tiles.length; i++)
        {
            const x = i % maxColum, y = ((i - x) / maxColum);
            ctx.drawImage(this.img, x * nw, y * nw, fw, fw, x*ss, y*ss, ss, ss);
        }
    }
}

function LoadSpritesheets (callback){
    RequestSys.get("/tilesheets", (data) => 
    {
        console.log(data);
        //const t = JSON.parse(evt.target.responseText);
        const tilesheets = data.reduce ((p, o) =>
        {
            const substrings = o.split(".");
            if(substrings[1] != "json") return p;
            p.push({name:substrings[0], type:substrings[1]});
            return p;
        }, []);
        callback(tilesheets);
    });
}

function CreateSpriteOptions (selectEl, defaultValue) {
    LoadSpritesheets(ts => 
    {
        selectEl.innerHTML = "";
        for (let i = 0; i < ts.length; i++)
        {
            const o = ts[i];
            const v =  o.name+"."+o.type;
            
            selectEl.append(CreateOption(o.name, v));
            if(defaultValue == v) selectEl.selectedIndex = i;
        }
    });   
}

function CreateOption (title, value)
{
    const el = document.createElement("option");
    el.textContent = title;
    el.value = value;
    return el;
}

export { SheetFile, LoadSpritesheets, CreateSpriteOptions, CreateOption };