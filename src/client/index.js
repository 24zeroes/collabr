(async function() {

    const ws = await connectToServer();    

    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        let text = 'color=' + messageBody.color + ';key=' + messageBody.key + ';code=' + messageBody.code +    
        (messageBody.shiftKey ? 'shiftKey' : '') +
        (messageBody.ctrlKey ? ' ctrlKey' : '') +
        (messageBody.altKey ? ' altKey' : '') +
        (messageBody.metaKey ? ' metaKey' : '') +
        (messageBody.repeat ? ' (repeat)' : '');

        console.log(text);
    };        
    

    document.body.onkeypress = (evt) => {
        const messageBody = { 
            code: evt.code, 
            key: evt.key, 
            shiftKey: evt.shiftKey,
            ctrlKey: evt.ctrlKey,
            altKey: evt.altKey,
            metaKey: evt.metaKey,
            repeat: evt.repeat,
        };
        ws.send(JSON.stringify(messageBody));
    };
        
    async function connectToServer() {    
        const ws = new WebSocket('ws://localhost:7071/ws');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer);
                    resolve(ws);
                    
                    console.log("Connection is opened");
                }
            }, 10);
        });   
    }

})();
