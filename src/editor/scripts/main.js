//import { TextParser, LoadHTMLText, LoadHTML, LoadXML, LoadJSON } from "../../scripts/loadobject.js";
//import { SpriteFrame, SpriteSource, GOSprite, AnimatedSprite } from "../../scripts/gosprite.js";
/* import { MapFile } from "./tilemap.js"; */
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

var filenames = [];
var files = [];

function LoadMap (){
    const loadedMap = JSON.parse(this.responseText);
    file = new MapFile(loadedMap);
    files.push(file);
    filenames.push(file.src)
    console.log(file);
}

function LoadTSheet (){
    const loadedSheet = JSON.parse(this.responseText);
    console.log(loadedSheet);
    sheet = loadedSheet;
    const maptitle = "sheet_" + loadedSheet.name + ".json";
    const titleEl = document.getElementById("arquivo-title");
    const datafile = document.getElementById("map-file");
    const aba = datafile.querySelector(".documento__aba");

    const tilesheetName = document.getElementById("tilesheets_name");
    const tilesheetBox = document.getElementById("tilesheets_box");
    
    //CreateSpriteOptions(tilesheetName, loadedSheet.tilesheet);

    titleEl.innerText = maptitle;
    aba.children[0].innerText = maptitle;
    aba.children[1].onclick = () => 
    {
        datafile.classList.add("hidden");
        titleEl.innerText = "";
        window.location.search = "";
    };
    
    document.getElementById("tilesheetmenu").classList.add("hidden");
    document.getElementById("tilesheetactions").classList.remove("hidden");  

    if(!sheet.img) 
    {
        const srcpath = "/tilesheets/"+sheet.src;
        sheet.img = new Image();
        sheet.img.onload = () => 
        {
            DrawSheetTiles();
        };
        if(sheet.img.src == srcpath) return;
        
        console.log(sheet.src);
        sheet.img.src = srcpath;
    }

    datafile.classList.remove("hidden");
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
        oReq.send("name="+tilemap);
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

function DrawSheetTiles ()
{
    const tilesheetsList = document.getElementById("tilesheets_box");
    tilesheetsList.innerHTML = ""; 
    const ss = sheet.size * zoom;
    const fw = sheet.pixels;
    const fs = sheet.space;
    const nw = fw + fs;
    const maxColum = Math.ceil((sheet.img.width + fs) / (nw));
    const maxRow = Math.ceil((sheet.img.height + fs) / (nw));
    tileCanvas.width = maxColum * ss;
    tileCanvas.height = maxRow * ss;
    tileCtx.clearRect(0,0, tileCanvas.width, tileCanvas.height);
    for(let i = 0; i < sheet.tiles.length; i++)
    {
        const x = i % maxColum, y = ((i - x) / maxColum);
        tileCtx.drawImage(sheet.img, x * nw, y * nw, fw, fw, x*ss, y*ss, ss, ss);
    }
}

