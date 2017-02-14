var request = require('request');
var botMessages = require('./botMessages.json');

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
                        console.log(event.message.seq);
                        
                        //check if 'wine' so we can start chatbot
                        if(event.message.text == 'Wine'){
                            //send first message
                            sendMessagewithTreeNum(event.sender.id, 0);
                            startingSequenceNum = event.message.seq;
                        }
                        
                        
                        
                        //check the tree number
                        var response = event.message;
                        var treeNum = event.message.seq;
                        
                        if(treeNum > startingSequenceNum){
                            //what type of wine are you drinking?//
                            
                            //record the wine type
                            var wineType = response.quick_reply.payload;
                            
                            //send the next message with wineType variable in it
                            sendMessagewithTreeNum(treeNum++);
                            
                        }
                    }
                });
            });
        }
        
        res.sendStatus(200);
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
    var messageObj = botMessages[treeNum];
    
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
    qs: { access_token: 'EAAPjiifdZBg8BABr7STcNJl6CCJuXrFpXMWuG28zendmg5bZBkQXzZBvXdnC2ImZBXiEhOZCIAkJyJxZCh22SsaSwI2riNm5pRP8pPn0xZAPtHd7ZBkmEdzTDIaASBQgG9IPvHaZBWyDwE5PMo0MP7t37iNGKfpu2iKXrnjT8ekOvfgZDZD' },
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

