const redis = require('redis');
let client;

module.exports = {
    init: function(){
        client = redis.createClient();
        client.on('error', (err)=>{
            console.error(err.stack || err);
        });
    },
    getEntriesBefore: function(ts){
        return new Promise((resolve, reject)=>{
            try{
                client.watch('entries', (err)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    client.multi()
                        .zrangebylex('entries', '-', `[${ts+1}`)
                        .zremrangebylex('entries', '-',`[${ts+1}`)
                        .exec(function (err, replies) {
                            if(err){
                                reject(err.errors || err);
                                return;
                            }
                            resolve(replies[0].map(e=>e.slice(14)));
                        });
                });
            }catch(err){
                reject(err);
            }
        });
    },
    addEntry: function({message, ts}){
        return new Promise((resolve, reject)=>{
            client.zadd('entries', 0, `${ts}:${message}`, (err, res)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(res > 0);
            });
        });
    }
};

