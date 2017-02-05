var message = {
    
    receieve: function(req, res){
        var recievedMessage = data; //fake message recieved
        res.json(receivedMessage);
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

var data = [{
  name: 'product 1',
  id: '1'
}, {
  name: 'product 2',
  id: '2'
}, {
  name: 'product 3',
  id: '3'
}];

module.exports = message;