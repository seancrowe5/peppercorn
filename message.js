var message = {
    
    receieve: function(req, res){
        var data = req.body;
        if(data.object === 'page'){
            data.entry.forEach(function(entry){
                var pageID = entry.id;
                var timeOfEvent = entry.time;
                entry.messaging.forEach(function(event){
                    if(event.message){
                        //we've received a message object from the user
                        //i guess now we want to analyze the message???
                        console.log(event.message)
                    }
                });
            });
        }
        
        res.sendStatus(200);
    },
    
    validate: function(req, res){
        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === 'hello') {
            console.log("Validating webhook");
            res.status(200).send(req.query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);          
        }  
    }   
};

module.exports = message;

