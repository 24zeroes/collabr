const mongoose = require("mongoose");
const config = require('config');
const Schema = mongoose.Schema;

const docScheme = new Schema({
    title: String,
    content: String,
    key: String
});


module.exports = {
    async getDocuments(){
        await mongoose.connect(`mongodb://${config.get('mongoDb.host')}:${config.get('mongoDb.port')}/${config.get('mongoDb.docsDbName')}`, 
                                { user: "accountAdmin01", pass: "admin", keepAlive: true, keepAliveInitialDelay: 300000 });
        const Doc = mongoose.model("Doc", docScheme);
        const docs = await Doc.find({});
        return docs;
    }

}