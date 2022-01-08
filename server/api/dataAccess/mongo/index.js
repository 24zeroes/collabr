const mongoose = require("mongoose");
const config = require('config');
const Schema = mongoose.Schema;

const docScheme = new Schema({
    title: String,
    content: String,
    key: String
});

mongoose.connect(`mongodb://${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.docsDbName')}`, 
{ user: config.get('mongoDb.user'), pass: config.get('mongoDb.pass'), keepAlive: true, keepAliveInitialDelay: 300000 });

const Doc = mongoose.model("Doc", docScheme);

module.exports = {
    async getDocuments(){

        const docs = await Doc.find({});
        return docs;
    },

    async getDocument(key){
        let doc = await Doc.findOne({key: key});
        doc.content = doc.content ? doc.content : '';
        return doc;
    },

    async createDocument(name, key){

        let newDoc = new Doc({ title: name, key: key, content: ''});
        newDoc = await newDoc.save();

    },

    async updateDocument(doc){
        await doc.updateOne({content: doc.content});
    }

}