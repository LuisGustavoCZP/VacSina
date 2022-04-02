function gameTimer (ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitFor(condition, interval = 100) {
    while(!await condition()){
        await gameTimer(interval);
    }
    return;
}

async function waitEvent (event) 
            {
                return new Promise(callback => 
                {
                    function executeEvent (e) 
                    {
                        window.removeEventListener(event, executeEvent)
                        callback(e.target.value);
                    }
                    window.addEventListener(event, executeEvent);
                });
            }

async function Loop(){
    
}

export {gameTimer, waitFor, waitEvent};