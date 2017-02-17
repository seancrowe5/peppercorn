var pg = require('pg');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var message = require('./message.js');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    console.log(process.env.DATABASE_URL);
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

app.get('/message', message.validate);
app.post('/message', function(){
    consol.log("hi");
});

app.post('/webhook', function (req, res) {
 var data = req.body;

 // Make sure this is a page subscription
 if (data.object === 'page') {

   // Iterate over each entry - there may be multiple if batched
   data.entry.forEach(function(entry) {
     var pageID = entry.id;
     var timeOfEvent = entry.time;

     // Iterate over each messaging event
     entry.messaging.forEach(function(event) {
       if (event.message) {
           //do something with message
         if(event.message.quick_reply){
             receivedTextMessage(event)
         }else{
             receivedMessage(event)
         }
       }else if (event.postback) {
          receivedPostback(event);
       } else {
         console.log("Webhook received unknown event: ", event);
       }
     });
   });

   // Assume all went well.
   //
   // You must send back a 200, within 20 seconds, to let us know
   // you've successfully received the callback. Otherwise, the request
   // will time out and we will keep trying to resend.
   res.sendStatus(200);
 }
});

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

function sendMessage(recipientId, promptNum) {
 
    //get the messagePromptObject
    var messageObject = messageWithPrompt[promptNum];
    
     //vars for building message
    var messageText = messageObject.message;
    var messageReplies =  messageObject.replies;
    
    var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text:messageText,
                quick_replies:messageReplies
            }
        };
    
    if(messageObject.url){
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment:{
                    type:"image",
                    payload:{
                        url:messageObject.url
                    }
                }  
            }
        };
    }
    
    
  
    
//  var messageData = {
//    recipient: {
//      id: recipientId
//    },
//    message: {
//      attachment: {
//        type: "template",
//        payload: {
//            template_type: "button",
//            text: messageText,
//            buttons:messageButtons
//        }
//      }
//    }
//  };  

  callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

    //received payload from user input....could have been from any message number
    var botPromptNum = payload.botPromptNumb
    
    //increment var
    completedBotPrompt++;
    
    //send the user the NEXT prompt
    sendMessage(senderID, completedBotPrompt);
    

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  //sendTextMessage(senderID, "Postback called");
}

function receivedTextMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.message.quick_reply.payload;

    //received payload from user input....could have been from any message number
    var botPromptNum = payload.botPromptNumb
    
    //increment var
    completedBotPrompt++;
    
    //send the user the NEXT prompt
    sendMessage(senderID, completedBotPrompt);
    

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  //sendTextMessage(senderID, "Postback called");
}



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


