const storage = require('../storage');
const config = require('../config');

module.exports.setDelayedMessage = async function(opts){
    return await storage.addEntry(opts);
};

module.exports.startMessagesOut = async function(out){
    await messagesOut(out);
    setInterval(async function(){
        try{
            await messagesOut(out);
        }catch(err){
            console.error(err.stack || err);
        }
    }, config.outIntervalSeconds * 1000);
}

async function messagesOut(out){
    let entries = await storage.getEntriesBefore(Date.now());
    if(entries.length > 0){
        for(let entry of entries){
            out.log(entry);
        }
    }
} 