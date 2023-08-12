#!/usr/bin/env nodejs

const express = require('express');
const app = express();
const config = require('config');
const restPort = config.get('api.port');

// REST
const { getDocuments, createDocument, getDocument, getSession, saveDocument } = require('./handlers/document/index');
app.use(express.json());
app.post('/document', ((request, response, next) => asyncUtil(getDocument(request, response, next))));
app.post('/document/save', ((request, response, next) => asyncUtil(saveDocument(request, response, next))));
app.post('/document/create', ((request, response, next) => asyncUtil(createDocument(request, response, next))));
app.get('/documents', ((request, response, next) => asyncUtil(getDocuments(request, response, next))));
app.get('/session',((request, response, next) => asyncUtil(getSession(request, response, next))));
app.listen(restPort);

// WS
const WebSocket = require('ws');
const wsPort = 7071
const wss = new WebSocket.Server({ port: wsPort });

function init(sessionsStore){
    wss.on('connection', (ws) => {
        console.log('new client');
    
        ws.on('message', (messageAsString) => {
          console.log('ws message: ' + messageAsString);
          wss.close();
        });  
    });

    wss.on("close", () => {
        console.log('ws closed');
      });
}

const asyncUtil = fn =>
function asyncUtilWrap(...args) {
  const fnReturn = fn(...args)
  const next = args[args.length-1]
  return Promise.resolve(fnReturn).catch(next)
}