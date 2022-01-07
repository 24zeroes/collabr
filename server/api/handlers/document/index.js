const db = require('../../dataAccess/pg');
const mongo = require('../../dataAccess/mongo');
const dmpObj = require('../../lib/diff');
const dmp = new dmpObj.diff_match_patch();
var sessionsStore = new Map();
var shadowsStore = new Map();

async function getDocument(request, response, next){
    const query = 'select name, content from documents as d join documentcontent as dc on dc.id = d.contentid where maskedname = $1';
    const params = [request.body.docId];
    
    const client = await db.getClient();
    try {
        const dbRes = await client.query(query, params);
        shadowsStore.set(request.body.sessionId, dbRes.rows[0].content.text);
        response.send(JSON.stringify({title: dbRes.rows[0].name, content: dbRes.rows[0].content.text}));
    } finally {
        client.release()
    }
}

async function getDocuments(request, response, next){
    let res = await mongo.getDocuments();
    response.send(JSON.stringify(res));
}

async function createDocument(request, response, next){
    const id = makeid(10);

    const query = 'WITH c AS (INSERT INTO documentcontent (content) VALUES ($1) RETURNING id) INSERT INTO documents (name, maskedname, contentid) VALUES ($2, $3, (SELECT id from c));';
    const params = [{text: ''}, request.body.name, id];

    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        const dbRes = await client.query(query, params);
        await client.query('COMMIT');
        response.send(JSON.stringify({id: id}));
    } catch(err) {
        console.log(err.stack);
        await client.query('ROLLBACK');
        response.status(500).send(err.stack);
    } 
    finally {
        client.release()
    }
}

async function saveDocument(request, response, next){
    const patchText = request.body.patchText;
    const sessionId = request.body.sessionId;
    const patches = dmp.patch_fromText(patchText);
  
    const shadowCopyResults = dmp.patch_apply(patches, shadowsStore[sessionId]);
    shadowsStore[sessionId] = shadowCopyResults[0];

    const query = 'select content from documents as d join documentcontent as dc on dc.id = d.contentid where maskedname = $1';
    const params = [request.body.docId];
    let documentText = undefined;
    const client = await db.getClient();

    const dbRes = await client.query(query, params);
    documentText = dbRes.rows[0].content.text;


    const documentTextResults = dmp.patch_apply(patches, documentText);
    documentText = documentTextResults[0];

    const updateQuery = 'update documentcontent set content = $1 where id = (select contentid from documents where maskedname = $2)';
    const updateParams = [{text: documentText}, request.body.docId];

    try {
        await client.query('BEGIN');
        const dbRes = await client.query(updateQuery, updateParams);
        await client.query('COMMIT');
    } catch(err) {
        console.log(err.stack);
        await client.query('ROLLBACK');
        response.status(500).send(err.stack);
    } 
    finally {
        client.release()
    }

    const diffs = { patches: getPatchesTextForClient(documentText, sessionId)};
    response.send(JSON.stringify(diffs));
}

async function getSession(request, response, next){
    const sessionId = uuidv4();
    sessionsStore.set(sessionId, "lul");
    const payload = { id : sessionId };
    response.send(JSON.stringify(payload));
}


function getPatchesTextForClient(source, sessionId){
    // On client
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
    getSession,
    saveDocument,
};