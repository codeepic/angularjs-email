var express = require('express'),
    mailer = require("express-mailer"),
    bodyParser = require("body-parser");

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());

//app.use(express.json());

app.set('views', __dirname + '/public');
app.set('view engine', 'jade');

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'your email goes here',
    pass: 'your email password goes here'
  }
});

app.route("/api/mail")
  .get(function(req, res, next){
  	res.sendfile(__dirname + "/public/data/mail.json");
  });

app.route("/api/send")
  .post(function(req, res, next){
    console.log("I made it to Express");
    console.log("subject: " + req.body.subject + "\n" +
    	          "body: " + req.body.body + "\n" + 
    	          "from: " + req.body.from)
    app.mailer.send('email', {
    	to: "ksaweryglab@gmail.com",
    	subject: req.body.subject,
    	body: req.body.body,
    	from: req.body.from
    }, function(err){
    	if(err){
    		console.log(err);
    		res.send("There was an error sending message");
    		return;
    	}
    	res.send("Email sent");
    });	
  })


app.listen(5000);

console.log('Running at :5000');