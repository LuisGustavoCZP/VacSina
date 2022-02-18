/* import { DataFile } from "./datafile.js";
export */ 
class MapFile extends DataFile 
{
    paintDrag = false;
    constructor (_data) {
        super(_data);
        this.src = `map_${_data.name}.json`;
        this.selectionid = 0;
        this.sheetName = document.getElementById("tilesheets_name");
        this.sheetBox = document.getElementById("tilesheets_box");
        this.sheetMenu = document.getElementById("tilesheetmenu");
        this.sheetActions = document.getElementById("tilesheetactions");
        this.LoadData(_data);
    }

    Select ()
    {
        super.Select();
        this.canvas.onclick = (evt) => {this.PaintMap(evt)};
        this.canvas.onpointerup = (evt) => {this.paintDrag = false;};
        this.canvas.onpointerdown = (evt) => {this.paintDrag = true;};
        this.canvas.onpointermove = (evt) => {this.ControlerMove(evt)};
    }

    LoadData (_data) {
        super.LoadData(_data);
        CreateSpriteOptions(this.sheetName, _data.tilesheet);
        this.sheetMenu.classList.remove("hidden");
        this.sheetActions.classList.add("hidden");
        this.CheckTiles ();
        this.main.classList.remove("hidden");
    }

    CheckTiles ()
    {
        const sheetName = this.data.tilesheet;
        console.log(`${this.sheet?.name} != ${sheetName}`);
        if(!this.sheet || this.sheet.name+".json" != sheetName)
        {
            const oReq = new XMLHttpRequest();
            oReq.onload = (evt) => 
            {
                this.sheet = JSON.parse(evt.target.responseText);  
                const srcpath = "/tilesheets/"+this.sheet.src;
                console.log(this.sheet);
                if(!this.sheet.img) 
                {
                    this.sheet.img = new Image();
                    this.sheet.img.onload = () => 
                    {
                        this.Draw();
                        this.CreateSheetItems ();
                    };
                }
                if(this.sheet.img.src == srcpath) return;
                console.log(this.sheet.src);
                this.sheet.img.src = srcpath;
            };
    
            oReq.open('POST', '/editor/loadtilesheet');
            oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            oReq.send("name="+sheetName);
        }
    }

    Draw ()
    {
        const sheet = this.sheet;
        const tiles = this.data.tiles;
        this.canvas.width = this.sheet.size * this.zoom * Math.sqrt(this.data.tiles.length);
        this.canvas.height = this.canvas.width;
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        tiles.forEach(tile => 
        {
            this.DrawTile(this.context, tile.x, tile.y, tile.type, sheet);
        });
    }

    DrawTile (context, x, y, type, tsheet) 
    {
        const size = this.zoom * tsheet.size;
        const hsize = size / 2;
        const posX = (x*size);
        const posY = (y*size);
        const fw = tsheet.pixels;
        const fs = tsheet.space;
        //const cx = posX + (canvas.width/2), cy = posY + (canvas.height/2);
        const nw = fw + fs;
        const maxColum = Math.ceil((tsheet.img.width + fs) / (nw));
        //console.log(this.spriteSheet.width + " " + this.maxColum + " " + this.x + " " + this.y);
        const ix = type % maxColum, iy = ((type - ix) / maxColum);
        const fx = nw * ix;
        const fy = nw * iy;
        //console.log(tile);
        //console.log(`hsize=${hsize} posX=${posX} posY=${posY} fw=${fw} fh=${fh} fs=${fs} fx=${fx} fy=${fy}`);
        context.drawImage(
            tsheet.img,
            fx,
            fy,
            fw,
            fw,
            posX, 
            posY,
            size,
            size
        );
    }
  
    CreateSheetItems ()
    {
        this.sheetBox.innerHTML = ""; 
        const t_canvas = document.createElement('canvas');
        const t_width = 50, t_height = 50;
        t_canvas.width = t_width;
        t_canvas.height = t_height;
        var t_context = t_canvas.getContext('2d');
    
        const sheet = this.sheet;
        const fw = sheet.pixels;
        const fs = sheet.space;
        const nw = fw + fs;
        const maxColum = Math.ceil((sheet.img.width + fs) / (nw));
        
        for(let i = 0; i < sheet.tiles.length; i++)
        {
            t_context.clearRect(0,0, t_width, t_height);
            const x = i % maxColum, y = ((i - x) / maxColum);
            const ts = sheet.img;
            //console.log(ts);
            const li = document.createElement("li");
            t_context.drawImage(ts, x * nw, y * nw, fw, fw, 0, 0, t_canvas.width, t_canvas.height);
            const icon = t_canvas.toDataURL();
            const liImg = document.createElement("img");
            liImg.src = icon;
            //console.log(icon);
            li.append(liImg);
            const n = i;
    
            li.onclick = () => 
            {
                this.sheetBox.children[this.selectionid].classList.remove("selected");
                this.selectionid = n;
                li.classList.add("selected");
                console.log(`Selecionou o tilesheet: ${n}`)
            };
            this.sheetBox.append(li);
        }
    }

    MapPosition (x, y) 
    {
        const p = this.MousePos(x,y);
        const nS = this.zoom * this.sheet.size;
        const nX = parseInt(p.x / nS);
        const nY = parseInt(p.y / nS);

        //console.log(`Position(${nX}, ${nY})`);
        return { "x":nX, "y":nY, "id":this.MapIndex(nX, nY)};
    }

    MapIndex (x, y)
    {
        const maxColum = Math.ceil(this.canvas.width/(this.sheet.size*this.zoom));//Math.ceil((this.sheet.img.width + sheet.space) / (sheet.pixels + sheet.space));
        return (y*maxColum) + x;
    }

    Index2D (i)
    {
        const maxColum = this.data.size;//Math.ceil(tileCanvas.width/(sheet.size*zoom));//Math.ceil((sheet.img.width + sheet.space) / (sheet.pixels + sheet.space));
        return {y: Math.floor(i/maxColum), x: i - (y*maxColum)};
    }

    PaintMap (e){
        e.preventDefault();
        const p = this.MapPosition(e.clientX, e.clientY);
        console.log(`Pintando ${p.id} de ${this.selectionid}`);
        const t = this.data.tiles[p.id];
        t.type = this.selectionid;
        this.Draw ();
    }

    ControlerMove (evt)
    {
        if(this.paintDrag) {
            this.PaintMap(evt);
            console.log("Pintando..");
        }
    } 

    Save () 
    {
        super.Save();
        console.log(this.data);
        fetch("/editor/modmap", 
        {
            method: 'post',
            body: JSON.stringify({"tiles":this.data.tiles, "name":this.data.name}),
            headers: { 'Content-Type': 'application/json' }
        })
        //.then((resp) => resp.json())
        .then(function (_data) {
            console.log(`Salvamento concluido: ${_data.sucess}`);
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
    }

}