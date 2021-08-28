// RestApi setup
const express = require('express')
const app = express()
const config = require('config');
const restPort = config.get('api.port');

const { getDocuments, createDocument } = require('./handlers/document/index');

app.use(express.json());
app.post('/document/create', ((request, response, next) => asyncUtil(createDocument(request, response, next))));

app.get('/documents', ((request, response, next) => asyncUtil(getDocuments(request, response, next))));
app.listen(restPort);

const asyncUtil = fn =>
function asyncUtilWrap(...args) {
  const fnReturn = fn(...args)
  const next = args[args.length-1]
  return Promise.resolve(fnReturn).catch(next)
}