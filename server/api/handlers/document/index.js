const db = require('../../dataAccess');

async function getDocuments(request, response, next){
    const query = 'SELECT name, contentId FROM public.documents';
    const client = await db.getClient();
    try {
        const dbRes = await client.query(query, []);
        response.send(JSON.stringify(dbRes.rows));
    } finally {
        client.release()
    }
}

async function createDocument(request, response, next){
    const id = makeid(10);

    const query = 'WITH c AS (INSERT INTO documentcontent (content) VALUES ($1) RETURNING id) INSERT INTO documents (name, maskedname, contentid) VALUES ($2, $3, (SELECT id from c));';
    const params = [{}, request.body.name, id];

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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

module.exports = {
    getDocuments,
    createDocument
};