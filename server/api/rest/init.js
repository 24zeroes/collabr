// RestApi setup
const express = require('express')
const app = express()
const config = require('config');
const restPort = config.get('api.port');
const dmpObj = require('../lib/diff');

const { Pool } = require('pg')
const pool = new Pool({
  user: config.get('pgDb.user'),
  host: config.get('pgDb.host'),
  database: config.get('pgDb.database'),
  password: config.get('pgDb.password'),
  port: config.get('pgDb.port'),
});


const dmpShadow = new dmpObj.diff_match_patch();
const dmp = new dmpObj.diff_match_patch();
var shadowCopies = {};
var documentText = "";
var documetName = "Important notes";

function init(sessionsStore){ 


    app.use(express.json());
    app.get('/session', (req, res) => {
        const sessionId = uuidv4();
        sessionsStore.set(sessionId, "lul");
        const response = { id : sessionId };
        res.send(JSON.stringify(response));
      })
      
    app.post('/document', (req, res) => {
        shadowCopies[req.body.sessionId] = documentText;
        console.log("\n shadowCopies = " + JSON.stringify(shadowCopies));
        const doc = { content : documentText, title : documetName };
        res.send(JSON.stringify(doc));
      })
    
    app.post('/document/create', asyncUtil(async (request, response, next) => {
      const id = makeid(10);
      const client = await pool.connect();
      try {
        const dbRes = await client.query(
          'WITH c AS (INSERT INTO documentcontent (content) VALUES ($1) RETURNING id) INSERT INTO documents (name, maskedname, contentid) VALUES ($2, $3, (SELECT id from c));', 
          [{}, request.body.name, id],
        );
        response.send(JSON.stringify({id: id}));
      } catch(err) {
        console.log(err.stack);
        response.status(500).send(err.stack);
      } 
      finally {
        client.release()
      }
    }))

    app.get('/documents', asyncUtil(async (request, response, next) => {
      const client = await pool.connect();
      try {
        const dbRes = await client.query(
          'SELECT name, contentId FROM public.documents', 
          []
        );
        response.send(JSON.stringify(dbRes.rows));
      } finally {
        client.release()
      }
    }))

    app.post('/document/save', (req, res) => {
      const patchText = req.body.patchText;
      const sessionId = req.body.sessionId;
      const patches = dmp.patch_fromText(patchText);

    
      const shadowCopyResults = dmp.patch_apply(patches, shadowCopies[sessionId]);
      shadowCopies[sessionId] = shadowCopyResults[0];

      const documentTextResults = dmp.patch_apply(patches, documentText);
      documentText = documentTextResults[0];

      console.log();
      console.log("shadowCopy of " + sessionId + " = " + shadowCopies[sessionId] + "\n" + "documentText = " + documentText);

      const diffs = { patches: getPatchesTextForClient(documentText, sessionId)};
      res.send(JSON.stringify(diffs));

    });

      app.listen(restPort);
}

function getPatchesTextForClient(source, sessionId){
    // On client
    let diff = dmp.diff_main(shadowCopies[sessionId], source, true);

    if (diff.length > 2) {
        dmp.diff_cleanupSemantic(diff);
    }
    const patch_list = dmp.patch_make(shadowCopies[sessionId], source, diff);
    
    shadowCopies[sessionId] = source;
    
    return patch_text = dmp.patch_toText(patch_list);
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const asyncUtil = fn =>
function asyncUtilWrap(...args) {
  const fnReturn = fn(...args)
  const next = args[args.length-1]
  return Promise.resolve(fnReturn).catch(next)
}

module.exports.init = init;