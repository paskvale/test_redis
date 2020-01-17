const express = require('express');
const app = express();
const storage = require('./storage');
const controllers = require('./controllers');
const services = require('./services');
const config = require('./config');
(async ()=>{
    try {
        await storage.init(config.redisConfig);

        try{
            await services.startMessagesOut(console);
        }catch(err){
            console.error(err.stack || err);
        }
        

        app.use(express.json());

        app.post('/api/echoAtTime', controllers.echoAtTime);
        
        app.use(function (err, req, res, next) {
            if (res.headersSent) {
                return next(err);
            }
            res.status(err.status);
            res.send(err.message);
        });

        app.listen(config.port, config.ip);
    } catch (err) {
        console.error(err.stack || err);
        process.exit(1);
    }
})();