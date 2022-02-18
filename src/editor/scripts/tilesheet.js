/* import { DataFile } from "./datafile.js";
export */ 
class SheetFile extends DataFile 
{
    constructor (_data) {
        super(_data);
        this.src = `sheet_${_data.name}.json`;
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
}

function LoadSpritesheets (callback){
    const oReq = new XMLHttpRequest();
    oReq.onload = evt => {
        const t = JSON.parse(evt.target.responseText);
        const tilesheets = t.reduce ((p, o) =>
        {
            const substrings = o.split(".");
            if(substrings[1] != "json") return p;
            p.push({name:substrings[0], type:substrings[1]});
            return p;
        }, []);
        callback(tilesheets);
    };
    oReq.open('GET', "/tilesheets");
    oReq.send();
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