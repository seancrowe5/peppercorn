var request = require('request');
var botMessages = require('./botMessages.json');

var treeNumber = 0;

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
                        console.log("message received");
                        console.log(treeNumber);
                        
                         //check if 'wine' so we can start chatbot
                        if(event.message.text == 'Wine'){
                            //send first message
                            treeNumber = 0;
                        }
//                        
                    
                        sendMessagewithTreeNum(event.sender.id, treeNumber);
                        treeNumber++;
                        
                        res.sendStatus(200);

                        
                       
//                        sendMessagewithTreeNum(event.sender.id, treeNum++);
//                       
   
//                       //check the tree number
//                        var response = event.message;
//                        var treeNum = event.message.seq;
//                        
//                        if(treeNum > startingSequenceNum){
//                            //what type of wine are you drinking?//
//                            
//                            //record the wine type
//                            var wineType = response.quick_reply.payload;
//                            
//                            //send the next message with wineType variable in it
//                            sendMessagewithTreeNum(treeNum++);
//                            
//                        }
                        
                        
                    }
                });
            });
        }
        
    },
    
    send: function(req, res){
        console.log('send message..data is: ', req.body);
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




function sendMessagewithTreeNum(recipientId, treeNum){
    
    var messageObj = null;
    do {
        messageObj = botMessages[treeNum];
        treeNum++;
    }
    while (!messageObj);
    
     //vars for building message
    var messageText = messageObj.text;
    
    //build quick replies
    var replyStr = messageObj.quick;
    var replyObj = [];
    replyStr.forEach(function(buttonStr) {
        
        var replyStructured = {
            content_type: "text",
            title: buttonStr,
            payload: "nil"
        };
        
        replyObj.push(replyStructured);
    });
    
    
    //build message object
    var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text:messageText,
                quick_replies:replyObj
            }
        };
    
//    if(messageObject.url){
//        var messageData = {
//            recipient: {
//                id: recipientId
//            },
//            message: {
//                attachment:{
//                    type:"image",
//                    payload:{
//                        url:messageObject.url
//                    }
//                }  
//            }
//        };
//    }
     

  callSendAPI(messageData);
    
    
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAPjiifdZBg8BAO0uDH0KcZBtAYvrgSa7qb0ZACsXZA6nbGyXLIYR6DB72fJX9kTBAyz1IGEm7fZBEsYku0J10yPcg0ksZBWICKsF642yh4X51VmzZAZBQrwj4sZCkV12gZCNguEBveGezZAOsPqPeIuCftahpRsuXzDMrZBxQItHV4pdQZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}



/*


function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'Wine':
        completedBotPrompt = 0;
        sendMessage(senderID, completedBotPrompt);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}


*/
module.exports = message;

