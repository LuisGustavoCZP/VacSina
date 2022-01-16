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

var map;
function LoadMap (){
    const loadedMap = JSON.parse(this.responseText);
    console.log(loadedMap);
    map = loadedMap;
    const maptitle = "map"+loadedMap.mapname+".json";
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
//#endregion