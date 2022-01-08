const db = require('../../dataAccess/pg');
const mongo = require('../../dataAccess/mongo');
const dmpObj = require('../../lib/diff');
const dmp = new dmpObj.diff_match_patch();
var sessionsStore = {};
var shadowsStore = {};

async function getDocument(request, response, next){

    try {
        let res = await mongo.getDocument(request.body.docId);
        
        let responseText = res.content !== undefined ? res.content : '';
        shadowsStore[request.body.sessionId] = responseText;
        response.send(JSON.stringify({title: res.title, text: responseText}));
    } catch(err) {
        console.log(err.stack);
        response.status(500).send(err.stack);
    } 
}

async function getDocuments(request, response, next){
    let res = await mongo.getDocuments();
    response.send(JSON.stringify(res));
}

async function createDocument(request, response, next){
    const id = makeid(10);

    try {
        let res = await mongo.createDocument(request.body.name, id);
        response.send(JSON.stringify({id: id}));
    } catch(err) {
        console.log(err.stack);
        response.status(500).send(err.stack);
    } 
}

async function saveDocument(request, response, next){
    
    const patchText = request.body.patchText;
    const sessionId = request.body.sessionId;
    const patches = dmp.patch_fromText(patchText);
    
    console.log(shadowsStore);
    const shadowCopyResults = dmp.patch_apply(patches, shadowsStore[sessionId]);
    console.log('shadowCopyResults ' +  shadowCopyResults);
    shadowsStore[sessionId] = shadowCopyResults[0];

    let doc = await mongo.getDocument(request.body.docId);
    documentText = doc.content;


    const documentTextResults = dmp.patch_apply(patches, documentText);
    documentText = documentTextResults[0];
    doc.content = documentText;

    try {
        await mongo.updateDocument(doc);
    } catch(err) {
        console.log(err.stack);
        response.status(500).send(err.stack);
    } 
    const diffs = { patches: getPatchesTextForClient(documentText, sessionId)};
    response.send(JSON.stringify(diffs));
}


function getPatchesTextForClient(source, sessionId){
    let diff = dmp.diff_main(shadowsStore[sessionId], source, true);

    if (diff.length > 2) {
        dmp.diff_cleanupSemantic(diff);
    }
    const patch_list = dmp.patch_make(shadowsStore[sessionId], source, diff);
    
    shadowsStore[sessionId] = source;

    return dmp.patch_toText(patch_list);
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

async function getSession(request, response, next){
    const sessionId = uuidv4();
    sessionsStore[sessionId] = true;
    const payload = { id : sessionId };
    response.send(JSON.stringify(payload));
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = {
    getDocuments,
    createDocument,
    getDocument,
    saveDocument,
    getSession,
};