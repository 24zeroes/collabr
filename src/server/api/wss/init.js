// WebSocket setup
const WebSocket = require('ws');
const wsPort = 7071
const wss = new WebSocket.Server({ port: wsPort });

function init(sessionsStore){
    wss.on('connection', (ws) => {
        const sessionId = uuidv4();
        const color = Math.floor(Math.random() * 360);
        const metadata = { sessionId, color };
    
        sessionsStore.set(ws, metadata);
        console.log("new client with session ID " + sessionId + " connected");
    
        ws.on('message', (messageAsString) => {
          const message = JSON.parse(messageAsString);
          const metadata = sessionsStore.get(ws);
    
          message.sender = metadata.sessionId;
          message.color = metadata.color;
    
          [...sessionsStore.keys()].forEach((client) => {
            client.send(JSON.stringify(message));
          });
        });  
    });

    wss.on("close", () => {
        sessions.delete(ws);
      });
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

module.exports.init = init;