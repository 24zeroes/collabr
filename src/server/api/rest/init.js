// RestApi setup
const express = require('express')
const app = express()
const restPort = 3000
const dmpLul = require('../lib/diff');
const dmp = new dmpLul.diff_match_patch();
var shadowCopy = "";
var documentText = "";

function init(sessionsStore){
    app.get('/session', (req, res) => {
        res.send('Hello World!')
      })
      
    app.get('/document', (req, res) => {
        const doc = { content : 'Hello World!'};
        shadowCopy = 'Hello World!';
        documentText = 'Hello World!';
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
          
          // Emulating document change
          let b = (Math.random() + 1).toString(36).substring(7);
          let position = Math.floor(Math.random() * documentText.length - 1);
          documentText = [documentText.slice(0, position), b, documentText.slice(position)].join('');
          console.log();
          console.log("documentText = " + documentText);

          const diffs = { patches: getPatchesTextForClient(documentText)};
          res.send(JSON.stringify(diffs));
        })

        

        
      })

      app.listen(restPort, () => {
        
      })
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