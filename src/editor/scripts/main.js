//import { TextParser, LoadHTMLText, LoadHTML, LoadXML, LoadJSON } from "../../scripts/loadobject.js";
//import { SpriteFrame, SpriteSource, GOSprite, AnimatedSprite } from "../../scripts/gosprite.js";
/* import { MapFile } from "./tilemap.js"; */
import { LoadSys } from "../../scripts/loadsys.js";
import { RequestSys } from "../../scripts/requestsys.js";
import { SheetFile, LoadSpritesheets, CreateSpriteOptions, CreateOption } from "./tilesheet.js";
import { MapFile } from "./tilemap.js";

const body = document.body;

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

//var zoom = 1;
var filenames = [];
var files = [];

function LoadMap (data){
    //const loadedMap = JSON.parse(this.responseText);
    const file = new MapFile(data);
    files.push(file);
    filenames.push(file.src)
    console.log(file);
}

function LoadTSheet (data){
    //const loadedSheet = JSON.parse(this.responseText);
    console.log(data);
    const sheetfile = new SheetFile(data);
    console.log(sheetfile);
    //sheetfile.Draw();

    const sheet = data;
    const maptitle = "sheet_" + sheet.name + ".json";
    const titleEl = document.getElementById("arquivo-title");
    const datafile = document.getElementById("data-file");
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
    /*
    if(!sheet.img) 
    {
        const srcpath = RequestSys.URL()+"/tilesheets/"+sheet.src;
        sheet.img = new Image();
        sheet.img.onload = () => 
        {
            DrawSheetTiles(sheet);
        };
        if(sheet.img.src == srcpath) return;
        
        console.log(sheet.src);
        sheet.img.src = srcpath;
    }*/

    datafile.classList.remove("hidden"); 
}

function LoadParams () 
{
    const urlparams = new URLSearchParams(window.location.search);
    const tilemap = urlparams.get("input-tilemap");
    if(tilemap != undefined){
        RequestSys.get(`/editor/loadmap/?name=${tilemap}`, LoadMap);
        /* const oReq = new XMLHttpRequest();
        oReq.onload = LoadMap;
        oReq.open('POST', '/editor/loadmap');
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send("name="+tilemap); */     
    }

    const tilesheet = urlparams.get("input-tilesheet");
    if(tilesheet != undefined){
        RequestSys.get(`/editor/loadtilesheet/?name=${tilesheet}`, LoadTSheet);
        /* const oReq = new XMLHttpRequest();
        oReq.onload = LoadTSheet;
        
        oReq.open('POST', '/editor/loadtilesheet');
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send("name="+tilesheet); */
    }

    //console.log(tilemap);
}
LoadParams ();

const menuSelections = 
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
    LoadSys.toHTML("mapcreation.html", x => 
    {
        x = x.body;
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
    LoadSys.toHTML("maploading.html", x => 
    {
        x = x.body;
        RequestSys.get("/tilemaps", data => 
        {
            const tsBox = x.querySelector("select");
            tsBox.innerHTML = "";
            const mapNames = data.reduce ((p, o) =>
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
        });

        x.querySelector("#cancelbutton").onclick = e => {CancelCreateMapa(popupWindow);};
        popupWindow.append(x);
    });
    body.insertBefore(popupWindow, body.firstChild);
    //mapcreation.tabIndex = 0;
}

function MenuTilesheetCreate ()
{   
    let popupWindow = document.createElement("div");
    popupWindow.classList.add("menu__windowbox");
    LoadSys.toHTML("tilesheetcreation.html", x => 
    {
        x = x.body;
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
    LoadSys.toHTML("tilesheetloading.html", x => 
    {
        x = x.body; 
        RequestSys.get("/tilesheets", data => 
        {
            //const t = JSON.parse(evt.target.responseText);
            const tsBox = x.querySelector("select");
            tsBox.innerHTML = "";
            const mapNames = data.reduce ((p, o) =>
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
        });

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

function DrawSheetTiles (sheet)
{
    
}

const modalWindows = [];

function initialize () 
{
    LoadSys.toJSON("/data/menuferramenta.json", 
    (ferramentaCategories) => 
    {
        const menu = document.querySelector(".menu");
        ferramentaCategories.forEach((ferramentaCategory, ci) => 
        {
            const ferCat = document.createElement("span");
            ferCat.classList.add("menu__ferramenta");
            ferCat.onpointerdown = () => { OnEnterMenu(ci); };
            ferCat.onpointerleave = () => { OnExitMenu(ci); };
            menu.append(ferCat);

            const ferCatTitle = document.createElement("span");
            ferCatTitle.innerText = ferramentaCategory.name;
            ferCatTitle.classList.add("menu__ferramenta_title");
            ferCat.append(ferCatTitle);

            const ferCatList = document.createElement("ul");
            ferCatList.id = ferramentaCategory.id;
            ferCatList.classList.add("menu__modalbox");
            ferCatList.classList.add("hidden");
            ferCat.append(ferCatList);
            modalWindows.push(ferCatList);

            ferramentaCategory.ferramentas.forEach((ferramenta, i) => 
            {
                const ferEl = document.createElement("li");
                ferEl.onclick = () => { menuSelect(ci, i) };
                ferCatList.append(ferEl);

                const ferElBox = document.createElement("span");
                ferElBox.classList.add("menu__modalbox__ferramenta");
                ferEl.append(ferElBox);

                const ferElImg = document.createElement("img");
                ferElImg.src = ferramenta.icon;
                ferElBox.append(ferElImg);

                const ferElTitle = document.createElement("span");
                ferElTitle.innerText = ferramenta.name;
                ferElBox.append(ferElTitle);
            });
            /* menu.innerHTML = `
            <span class="menu__ferramenta">
                <span style="text-decoration: underline;">E</span>ditar
                <ul id="menu-editar" class="">
                    <li onclick="">
                        <span class="menu__modalbox__ferramenta">
                            <img src="images/aula14ex2screenshot2.png" />
                            <span>Desfazer</span>
                        </span>
                    </li>
                </ul>
            </span>`; */
        });
        /* console.log(ferramentas);
        const menuferramenta = document.querySelector("menu_ferramentas");
        menuferramenta.onpointerdown = OnEnterMenu(1);
        menuferramenta.onpointerleave = OnExitMenu(1); */
    });
}

initialize ();