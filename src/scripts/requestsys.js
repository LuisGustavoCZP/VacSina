let ortoPath = document.location.origin;
if(ortoPath.includes(":8080")) ortoPath = ortoPath.slice(0, ortoPath.lastIndexOf(":8080"));
else if(ortoPath.endsWith("/")) ortoPath = ortoPath.slice(0, ortoPath.lastIndexOf("/")-1);

function requestSys (url=ortoPath+":8000") //"https://vacsina.servegame.com:8000/"
{
    /**
     * 
     * @param {String} path 
     * @param {void} sucess 
     * @param {ErrorCallback} fail 
     * @returns 
     */
    async function get (path, sucess=(data)=>{}, fail=(error)=>{ console.log(error); }) 
    {
        return fetch(url+path, 
        {
            method: 'get',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(sucess)
        .catch(fail);
    }

    async function post (path, body, sucess=(data)=>{}, fail=(error)=>{ console.log(error); }) 
    {
        return fetch(url+path, 
        {
            method: 'post',
            body: JSON.stringify(body),
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(sucess)
        .catch(fail);
    }

    function URL () 
    {
        return url;
    }

    return { get, post, URL };
}

const RequestSys = requestSys ();

export {RequestSys};


/* const oReq = new XMLHttpRequest();

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
oReq.send(); */