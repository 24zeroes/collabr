// Shared objects
const sessions = new Map();

const wsServer = require('./wss/init');
wsServer.init(sessions);

const restServer = require('./rest/init');
restServer.init(sessions);