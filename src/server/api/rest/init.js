// RestApi setup
const express = require('express')
const app = express()
const restPort = 3000
const dmpObj = require('../lib/diff');
const dmpShadow = new dmpObj.diff_match_patch();
const dmp = new dmpObj.diff_match_patch();
var shadowCopy = "";
var documentText = "";
var documetName = "Important notes";

function init(sessionsStore){ 
    app.get('/session', (req, res) => { 
        res.send('Hello World!')
      })
      
    app.get('/document', (req, res) => {
        const doc = { content : documentText, title : documetName };
        res.send(JSON.stringify(doc));
      })

    app.post('/document/save', (req, res) => {
        // Gettin request body data
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        })
        req.on('end', () => { 

          const patches = dmp.patch_fromText(data);

          const shadowCopyResults = dmp.patch_apply(patches, shadowCopy);
          shadowCopy = shadowCopyResults[0];

          const documentTextResults = dmp.patch_apply(patches, documentText);
          documentText = documentTextResults[0];

          console.log();
          console.log("shadowCopy = " + shadowCopy);

          const diffs = { patches: getPatchesTextForClient(documentText)};
          res.send(JSON.stringify(diffs));
        })
      })

      app.listen(restPort)
}

function getPatchesTextForClient(source){
    // On client
    let diff = dmp.diff_main(shadowCopy, source, true);

    if (diff.length > 2) {
        dmp.diff_cleanupSemantic(diff);
    }
    const patch_list = dmp.patch_make(shadowCopy, source, diff);
    
    shadowCopy = source;
    
    return patch_text = dmp.patch_toText(patch_list);
}

module.exports.init = init;