/**
 * @LuisGustavoCZP
 */
function loadSys ()
{ 
    /**
    * @param {String} text
    * @param {String} type
    */
    function parse(text , type){
        let domParser = new DOMParser();
        return domParser.parseFromString(text, type);
    }

    /**
     * @param {String} path
     * @param {Function} callback
     */
    function toJSON(path, callback)
    {
        fetch(path)
        .then((data) => data.json())
        .then(callback)
        .catch((error) => {console.log(error)});
    }

    /**
     * @param {String} path
     * @param {Function} callback
     */
    function toHTML(path, callback)
    {
        toText (path, (data) => { callback(parse(data, "text/html")) });
    }

    /**
     * @param {String} path
     * @param {Function} callback
     */
    function toXML(path, callback)
    {
        toText (path, (data) => { callback(parse(data, "text/xml")) });
    }

    /**
     * @param {String} path
     * @param {Function} callback
     */
    function toText(path, callback)
    {
        fetch(path)
        .then((data) => data.text())
        .then(callback)
        .catch((error) => {console.log(error)});
    }

    return { toXML, toJSON, toHTML, toText, parse };
}

/**
* @param {String} origin
*/
function OrtoPath (origin) 
{
    /**
    * @param {String} path
    * @returns {String}
    */
    function Convert (path){
        const lastFolder = origin.slice(0, origin.lastIndexOf("/"));
        let upFolder = path.indexOf("../");
        while(upFolder != -1)
        {
            path.slice(upFolder+3);
            upFolder = path.indexOf("../");
        }

        console.log(path);
    }

    return {Convert};
}

const LoadSys = loadSys ();

export { LoadSys, OrtoPath };