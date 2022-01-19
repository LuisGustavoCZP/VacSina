//import { TextParser, LoadHTMLText, LoadHTML, LoadXML, LoadJSON } from "../../scripts/loadobject.js";
//import { SpriteFrame, SpriteSource, GOSprite, AnimatedSprite } from "../../scripts/gosprite.js";

var body = document.body;

//#region Styles
var estiloLink = document.getElementById("estilo");
var styles = 
[
    "styles/styleGreen.css", 
    "styles/styleBlue.css"
];

function OnClickEstilo(indice)
{
    estiloLink.href = styles[indice];
}
//#endregion
//#region Menu 
var modalWindows = 
[
    document.getElementById("menu-ficheiro"),
    document.getElementById("menu-editar")
];
var modalPosX = 0;
function OnEnterMenu(indice)
{
    let modal = modalWindows[indice];
    modalPosX = modal.parentElement.style.left-10;
    modalWindows[indice].classList.remove("hidden");
}
function OnExitMenu(indice)
{
    modalWindows[indice].classList.add("hidden");
}
const mapfile = document.getElementById("map-file");
const tileCanvas = mapfile.querySelector(".documento__conteudo__edicao > canvas");
const tileCtx = tileCanvas.getContext("2d");
var zoom = 1;
var tiletype = 0;
var map;
var sheet;
function LoadMap (){
    const loadedMap = JSON.parse(this.responseText);
    console.log(loadedMap);
    map = loadedMap;
    const maptitle = "map"+loadedMap.mapname+".json";
    const titleEl = document.getElementById("arquivo-title");
    
    const aba = mapfile.querySelector(".documento__aba");
    const tilesheetName = document.getElementById("tilesheets_name");
    const tilesheetBox = document.getElementById("tilesheets_box");
    
    CreateSpriteOptions(tilesheetName, loadedMap.tilesheet);

    titleEl.innerText = maptitle;
    aba.children[0].innerText = maptitle;
    aba.children[1].onclick = () => 
    {
        mapfile.classList.add("hidden");
        titleEl.innerText = "";
        window.location.search = "";
    };
    
    CheckTiles ();
    mapfile.classList.remove("hidden");
}

function LoadTSheet (){
    const loadedMap = JSON.parse(this.responseText);
    console.log(loadedMap);
    map = loadedMap;
    const maptitle = "tilesheet" + loadedMap.name + ".json";
    const titleEl = document.getElementById("arquivo-title");
    const mapfile = document.getElementById("map-file");
    const aba = mapfile.querySelector(".documento__aba");

    const tilesheetName = document.getElementById("tilesheets_name");
    const tilesheetBox = document.getElementById("tilesheets_box");
    
    CreateSpriteOptions(tilesheetName, loadedMap.tilesheet);

    titleEl.innerText = maptitle;
    aba.children[0].innerText = maptitle;
    aba.children[1].onclick = () => 
    {
        mapfile.classList.add("hidden");
        titleEl.innerText = "";
        window.location.search = "";
    };

    mapfile.classList.remove("hidden");
}

function LoadParams () 
{
    const urlparams = new URLSearchParams(window.location.search);
    const tilemap = urlparams.get("input-tilemap");
    if(tilemap != undefined){
        const oReq = new XMLHttpRequest();
        oReq.onload = LoadMap;
        
        oReq.open('POST', '/editor/loadmap');
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send("mapname="+tilemap);
    }

    const tilesheet = urlparams.get("input-tilesheet");
    if(tilesheet != undefined){
        const oReq = new XMLHttpRequest();
        oReq.onload = LoadTSheet;
        
        oReq.open('POST', '/editor/loadtilesheet');
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send("name="+tilesheet);
    }

    //console.log(tilemap);
}
LoadParams ();

var menuSelections = 
[
    [
        MenuTilemapCreate,
        MenuTilemapLoad,
        MenuTilesheetCreate,
        MenuTilesheetLoad,
    ]
];

function menuSelect (i, j)
{
    menuSelections[i][j]();
}

//#endregion
//#region Mapa

function CreateOption (title, value)
{
    const el = document.createElement("option");
    el.textContent = title;
    el.value = value;
    return el;
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

function MenuTilemapCreate ()
{   
    let popupWindow = document.createElement("div");
    popupWindow.classList.add("menu__windowbox");
    LoadHTML("mapcreation.html", x => 
    {
        CreateSpriteOptions(x.querySelector("select"), undefined);

        x.querySelector("#cancelbutton").onclick = x => {CancelCreateMapa(popupWindow);};
        popupWindow.append(x);
    });
    body.insertBefore(popupWindow, body.firstChild);
    //mapcreation.tabIndex = 0;
}

function MenuTilemapLoad ()
{   
    let popupWindow = document.createElement("div");
    popupWindow.classList.add("menu__windowbox");
    LoadHTML("maploading.html", x => 
    {
        const oReq = new XMLHttpRequest();
        oReq.onload = evt => {
            const t = JSON.parse(evt.target.responseText);
            const tsBox = x.querySelector("select");
            tsBox.innerHTML = "";
            const mapNames = t.reduce ((p, o) =>
            {
                const substrings = o.split(".");
                if(substrings[1] != "json") return p;
                p.push({name:substrings[0], type:substrings[1]});
                return p;
            }, []);
            for (let i = 0; i < mapNames.length; i++)
            {
                const o = mapNames[i];
                //console.log(o);
                tsBox.append(CreateOption(o.name, o.name+"."+o.type));
            }
        };
        oReq.open('GET', "/tilemaps");
        oReq.send();

        x.querySelector("#cancelbutton").onclick = x => {CancelCreateMapa(popupWindow);};
        popupWindow.append(x);
    });
    body.insertBefore(popupWindow, body.firstChild);
    //mapcreation.tabIndex = 0;
}

function MenuTilesheetCreate ()
{   
    let popupWindow = document.createElement("div");
    popupWindow.classList.add("menu__windowbox");
    LoadHTML("tilesheetcreation.html", x => 
    {
        x.querySelector("#cancelbutton").onclick = x => {CancelCreateMapa(popupWindow);};
        popupWindow.append(x);
    });
    body.insertBefore(popupWindow, body.firstChild);
    //mapcreation.tabIndex = 0;
}

function MenuTilesheetLoad ()
{   
    let popupWindow = document.createElement("div");
    popupWindow.classList.add("menu__windowbox");
    LoadHTML("tilesheetloading.html", x => 
    {
        const oReq = new XMLHttpRequest();
        oReq.onload = evt => {
            const t = JSON.parse(evt.target.responseText);
            const tsBox = x.querySelector("select");
            tsBox.innerHTML = "";
            const mapNames = t.reduce ((p, o) =>
            {
                const substrings = o.split(".");
                if(substrings[1] != "json") return p;
                p.push({name:substrings[0], type:substrings[1]});
                return p;
            }, []);
            for (let i = 0; i < mapNames.length; i++)
            {
                const o = mapNames[i];
                //console.log(o);
                tsBox.append(CreateOption(o.name, o.name+"."+o.type));
            }
        };
        oReq.open('GET', "/tilesheets");
        oReq.send();

        x.querySelector("#cancelbutton").onclick = x => {CancelCreateMapa(popupWindow);};
        popupWindow.append(x);
    });
    body.insertBefore(popupWindow, body.firstChild);
    //mapcreation.tabIndex = 0;
}

function FinishCreateMapa (popupWindow) 
{
    popupWindow.remove();
}

function CancelCreateMapa (popupWindow) 
{
    popupWindow.remove();
}

function CreateTilesheet () 
{
    const nameInp = document.getElementById("input-name");
    const srcInp = document.getElementById("input-src");
    const fReader = new FileReader();
    fReader.onload = () => 
    {
        const tsFile = fReader.result;
        if (srcInp.files && srcInp.files[0]) 
        {
            const img = new Image();
            img.onload = () => 
            {
                URL.revokeObjectURL(img.src);
                const tsData = 
                {
                    "name": nameInp.value,
                    "src": "",
                    "size": parseInt(document.getElementById("input-size").value),
                    "pixels": parseInt(document.getElementById("input-pixels").value),
                    "space": parseInt(document.getElementById("input-space").value),
                    "tiles": []
                };

                const ispace = tsData.space;
                const nw = tsData.pixels + ispace;
                //console.log(tsfile);

                const maxColum = Math.ceil((img.width + ispace) / (nw));
                const maxRow = Math.ceil((img.height + ispace) / (nw));

                console.log(tsData.pixels + " (" + maxColum+","+ maxRow +")");

                for(let j = 0; j < maxColum; j++){
                    for(let i = 0; i < maxRow; i++){
                    const id = i+(j*maxRow);
                        tsData.tiles.push({id:id, block:false});
                    }
                }

                console.log(tsData);

                const infoData = {"file":tsFile, "data":tsData};

                fetch("/editor/newtilesheet", 
                {
                    method: 'post',
                    body: JSON.stringify(infoData),
                    headers: { 'Content-Type': 'application/json' }
                })
                //.then((resp) => resp.json())
                .then(function (data) {
                    console.log(data);
                })
                .catch(function (error) {
                    console.log('Request failed', error);
                });
            }
            img.src = URL.createObjectURL(srcInp.files[0]);
        }
    };

    const k = srcInp.files[0];
    console.log(k);
    fReader.readAsDataURL(k);
}
//#endregion

function CheckTiles ()
{
    console.log(`${sheet?.name} != ${map.tilesheet}`);
    if(!sheet || sheet.name+".json" != map.tilesheet)
    {
        const oReq = new XMLHttpRequest();
        oReq.onload = (evt) => 
        {
            sheet = JSON.parse(evt.target.responseText);  
            const srcpath = "/tilesheets/"+sheet.src;
            console.log(sheet);
            if(!sheet.img) 
            {
                sheet.img = new Image();
                sheet.img.onload = () => 
                {
                    DrawTiles();
                    CreateSheetItems ();
                };
            }
            if(sheet.img.src == srcpath) return;
            console.log(sheet.src);
            sheet.img.src = srcpath;
            //CheckTiles ();
           
        };

        oReq.open('POST', '/editor/loadtilesheet');
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send("name="+map.tilesheet);
    }
}

function CreateSheetItems ()
{
    const tilesheetsList = document.getElementById("tilesheets_box");
    tilesheetsList.innerHTML = ""; 
    const t_canvas = document.createElement('canvas');
    const t_width = 50, t_height = 50;
    t_canvas.width = t_width;
    t_canvas.height = t_height;
    var t_context = t_canvas.getContext('2d');

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
            tiletype = n;
            console.log(`Selecionou o tilesheet: ${n}`)
        };
        tilesheetsList.append(li);
    }
}

function DrawTiles ()
{
    tileCanvas.width = sheet.size * zoom * Math.sqrt(map.tiles.length);
    tileCanvas.height = tileCanvas.width;
    tileCtx.clearRect(0,0, tileCanvas.width, tileCanvas.height);
    map.tiles.forEach(item => 
    {
        DrawTile(tileCanvas, tileCtx, item, sheet);
    });
}

function DrawTile (canvas, context, tile, tsheet) {
    const size = zoom * tsheet.size;
    const hsize = size / 2;
    const posX = (tile.x*size);
    const posY = (tile.y*size);
    const fw = tsheet.pixels;
    const fs = tsheet.space;
    //const cx = posX + (canvas.width/2), cy = posY + (canvas.height/2);
    const nw = fw + fs;
    const maxColum = Math.ceil((tsheet.img.width + fs) / (nw));
    //console.log(this.spriteSheet.width + " " + this.maxColum + " " + this.x + " " + this.y);
    const x = tile.type % maxColum, y = ((tile.type - x) / maxColum);
    const fx = nw * x;
    const fy = nw * y;
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

function ChangeZoom (evt) 
{
    evt.preventDefault();

    zoom += evt.deltaY * -0.001;

    // Restrict scale
    zoom = Math.min(Math.max(.125, zoom), 4);
    DrawTiles ();
}
tileCanvas.onwheel = ChangeZoom;

function MapPosition (x, y) 
{
    const pos = tileCanvas.getBoundingClientRect();
    const offsetX = - pos.left;
    const offsetY = - pos.top;
    
    const pX = x+offsetX; //-(tileCanvas.width/2)
    const pY = y+offsetY; //-(tileCanvas.height/2)

    const nS = zoom * sheet.size;
    const nX = parseInt(pX / nS);
    const nY = parseInt(pY / nS);

    //console.log(`Position(${nX}, ${nY})`);
    return { "x":nX, "y":nY, "id":MapIndex(nX, nY)};
}

function MapIndex (x, y)
{
    const maxColum = Math.ceil(tileCanvas.width/(sheet.size*zoom));//Math.ceil((sheet.img.width + sheet.space) / (sheet.pixels + sheet.space));
    return (y*maxColum) + x;
}

function PaintMap (e){
    e.preventDefault();
    const p = MapPosition(e.clientX, e.clientY);
    console.log(`Pintando ${p.id} de ${tiletype}`);
    const t = map.tiles[p.id];
    console.log(map);
    t.type = tiletype;
    DrawTiles ();
}

tileCanvas.onclick = PaintMap;