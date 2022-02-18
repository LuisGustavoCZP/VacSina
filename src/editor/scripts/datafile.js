/* export */ 
class DataFile 
{
    data;
    zoom = 1;
    selectionid = 0;

    constructor (_data) {
        this.src = "";
        this.data = _data;
        this.main = document.getElementById("data-file");
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.title = document.getElementById("arquivo-title");
        this.tabs = document.getElementById("abas");
        this.tab = this.CreateTab();//this.main.querySelector(".documento__aba");
        this.tools = document.getElementById("ferramentas");
        this.tools.children[1].onclick = () => {this.Save()};
        this.Select ();
    }

    CreateTab () {
        const li = document.createElement("li");
        li.classList.add("documento__aba");
        const t = document.createElement("span");
        t.innerText = "";
        li.append(t);
        const b = document.createElement("button");
        b.innerText = "x";
        li.append(b);
        this.tabs.append(li);
        return li;
    }

    LoadData (_data) 
    {
        this.title.innerText = this.src;
        this.tab.children[0].innerText = this.src;
        this.tab.children[1].onclick = () => 
        {
            this.main.classList.add("hidden");
            this.title.innerText = "";
            window.location.search = "";
        };
    }

    Select () {
        this.canvas.onwheel = e => {this.ChangeZoom(e)};
    }

    Draw () 
    {

    }

    MousePos (x, y) 
    {
        const pos = this.canvas.getBoundingClientRect();
        return {x: x - pos.left, y: y - pos.top};
    }

    MoveCamera (_x, _y) {
        const box = this.canvas.parentElement;
        const w = box.clientWidth/2;
        const h = box.clientHeight/2;
        const x = _x - w;
        const y = _y - h;
        box.scrollLeft = x; //+ p.w
        box.scrollTop = y; //+ p.h
        return {"ox":_x, "oy":_y, w, h, x, y};
    }

    ChangeZoom (evt) 
    {
        const maxZoom = 2, minZoom = .25;
        evt.preventDefault();
        //
        const lastZoom = this.zoom;
        this.zoom += evt.deltaY * -0.001;

        if(this.zoom < maxZoom && this.zoom > minZoom)
        {
            const size = (this.zoom / lastZoom);
            const p = this.MousePos(evt.clientX, evt.clientY);
            const box = this.canvas.parentElement;
            const dx = p.x - box.scrollLeft;
            const dy = p.y - box.scrollTop;
            //console.log(this.MoveCamera(px, py));
            box.scrollLeft = ((p.x)*size) - dx;
            box.scrollTop = ((p.y)*size) - dy;
        }  

        this.zoom = Math.min(Math.max(minZoom, this.zoom), maxZoom);
        this.Draw ();
    }

    Save ()
    {
        console.log(`Salvando ${this.src}...`);
    }
}

/* function ZoomScript (event) {
    const lastZoom = zoom;
    zoom += evt.deltaY * -0.001;
    const rect = this.canvas.getBoundingClientRect();
    const mousex = event.clientX - rect.left;
    const mousey = event.clientY - rect.top;
    const size = (zoom / lastZoom);
    const box = this.canvas.parentElement;
    box.scrollLeft = (mousex*size) - (mousex - box.scrollLeft);
    box.scrollTop = (mousey*size) - (mousey - box.scrollTop);
} */