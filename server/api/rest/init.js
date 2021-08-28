// RestApi setup
const express = require('express')
const app = express()
const config = require('config');
const restPort = config.get('api.port');
const dmpObj = require('../lib/diff');

const { Pool } = require('pg')



const dmpShadow = new dmpObj.diff_match_patch();
const dmp = new dmpObj.diff_match_patch();
var shadowCopies = {};
var documentText = "";
var documetName = "Important notes";

function init(sessionsStore){ 
    const pool = new Pool({
      user: config.get('pgDb.user'),
      host: config.get('pgDb.host'),
      database: config.get('pgDb.database'),
      password: config.get('pgDb.password'),
      port: config.get('pgDb.port'),
    });

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
    
    app.post('/document/create', (req, res) => {
      const id = makeid(10);
      pool.query(
        {
            text: 'WITH c AS (INSERT INTO documentcontent (content) VALUES ($1) RETURNING id) INSERT INTO documents (name, maskedname, contentid) VALUES ($2, $3, (SELECT id from c));'}, 
            [{}, req.body.name, id], 
            (err, dbRes) => {
              if (err) {
                console.log(err.stack);
                res.status(500).send(err.stack);
              }
              else
              {
                const doc = { id: id};
                res.send(JSON.stringify(doc));
              }
        });
    })

    app.get('/documents', (req, requestRes) => {
      pool.query(
      {
          text: 'SELECT name, contentId FROM public.documents'}, 
          [], 
          (err, dbRes) => {
            if (err) {
              console.log(err.stack)
            } else {
              requestRes.send(JSON.stringify(dbRes.rows));
            }
      })
    })

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

module.exports.init = init;