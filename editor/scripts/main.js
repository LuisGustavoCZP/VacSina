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
    modal.style.display = "block";
}
function OnExitMenu(indice)
{
    modalWindows[indice].style.display = "none";
}

var menuSelections = 
[
    [
        WindowCreateMapa,
        evt => {},
        evt => {},
        evt => {},
    ]
];

function menuSelect (i, j)
{
    menuSelections[i][j]();
}

//#endregion
//#region Mapa
var map = document.createElement("mapa");
map.id = "mapa";

function WindowCreateMapa (evt)
{
    console.log("Clicou");
    
    let popupWindow = document.createElement("div");
    popupWindow.classList.add("menu__windowbox");
    LoadHTML("mapcreation.html", x => 
    {
        x.querySelector("#cancelbutton").onclick = x => {CancelCreateMapa(popupWindow);};
        x.querySelector("#createbutton").onclick = x => {FinishCreateMapa(popupWindow);};
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