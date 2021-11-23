function HTMLParser (text){
    let domParser = new DOMParser();
    return domParser.parseFromString(text, "text/html");
}

function LoadHTMLText (path, act)
{
    let xmlHttp = new XMLHttpRequest();
    //let element = document.documentElement;

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            act (xmlHttp.responseText);
        }
    };

    start = new Date().getTime();

    xmlHttp.open("GET", path, true); // true for asynchronous
    xmlHttp.send(null);
}

function LoadHTML (path, act)
{
    LoadHTMLText(path, x => 
    {
        let doc = HTMLParser(x);
        var element = doc.body.firstChild;
        
        //console.log(element);

        act(element);
    });
}