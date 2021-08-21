// RestApi setup
const express = require('express')
const app = express()
const restPort = 3000
const dmpObj = require('../lib/diff');

const { Pool } = require('pg')
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'collabr',
  password: 'admin',
  port: 5432,
})



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

    app.get('/documents', (req, requestRes) => {
      let result = [];
      pool.query({text: 'SELECT * FROM public.documents'}, [], (err, dbRes) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log(dbRes.rows)
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

module.exports.init = init;