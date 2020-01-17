const services = require('../services');
module.exports.echoAtTime = async function(req, res){
    try{
        let {message, time} = req.body;
        time = new Date(time);
        let ts = time.getTime();
        if(
            !message
            || Object.prototype.toString.call(message) !== '[object String]'
            || !(time instanceof Date)
            || Number.isNaN(time)
            || ts < Date.now()
        ){
            res.status(400);
            res.send({error: 'Bad Request'});
            return;
        }
        res.send({
            success: await services.setDelayedMessage({
                message, 
                ts
            })
        });
    }catch(err){
        console.error(err.stack || err);
        res.status(500);
        res.send({error: 'Internal Server Error'});
    }
};