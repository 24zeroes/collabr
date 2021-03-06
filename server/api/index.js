#!/usr/bin/env nodejs

const express = require('express')
const app = express()
const config = require('config');
const restPort = config.get('api.port');

const { getDocuments, createDocument, getDocument, getSession, saveDocument } = require('./handlers/document/index');

app.use(express.json());
app.post('/document', ((request, response, next) => asyncUtil(getDocument(request, response, next))));
app.post('/document/save', ((request, response, next) => asyncUtil(saveDocument(request, response, next))));
app.post('/document/create', ((request, response, next) => asyncUtil(createDocument(request, response, next))));

app.get('/documents', ((request, response, next) => asyncUtil(getDocuments(request, response, next))));

app.get('/session',((request, response, next) => asyncUtil(getSession(request, response, next))));
app.listen(restPort);

const asyncUtil = fn =>
function asyncUtilWrap(...args) {
  const fnReturn = fn(...args)
  const next = args[args.length-1]
  return Promise.resolve(fnReturn).catch(next)
}