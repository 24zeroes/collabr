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

module.exports.getDocuments = getDocuments;