(async function() {

    const ws = await connectToServer();    

    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        let text = 'color= ' + messageBody.color + 'key= ' + messageBody.key + ' code= ' + messageBody.code +    (e.shiftKey ? ' shiftKey' : '') +
        (e.ctrlKey ? ' ctrlKey' : '') +
        (e.altKey ? ' altKey' : '') +
        (e.metaKey ? ' metaKey' : '') +
        (e.repeat ? ' (repeat)' : '');
    
        console.log(text);
    };        
    
    document.body.onkeypress = (evt) => {
        const messageBody = { code: evt.code, key: evt.key };
        ws.send(JSON.stringify(messageBody));
    };
        
    async function connectToServer() {    
        const ws = new WebSocket('ws://localhost:7071/ws');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer);
                    resolve(ws);
                }
            }, 10);
        });   
    }

})();
