import { RequestSys } from "./requestsys.js";

function filterField(e) {
    let t = e.target;
    let badValues = /[^\w\d]/g;//i
    t.value = t.value.replace(badValues, '');
}
document.getElementById('input-user').addEventListener('input', filterField);
document.getElementById('input-pass').addEventListener('input', filterField);
document.getElementById('login-button').addEventListener('click', userLogin);

function userLogin ()
{
    RequestSys.post("/login", {user:document.getElementById('input-user').value, pass:document.getElementById('input-pass').value}, (resp) => 
    {
        //console.log(resp);
        RequestSys.get("/test", (resp) => 
        {
            console.log(resp);
            
        });
    });
}


/* function getCookie(cname) 
{
    var arrayb = document.cookie.split(";");
    for (const item of arrayb) {
      if (item.startsWith("Token=")){
          return item.split(6);
      }
    }
} */