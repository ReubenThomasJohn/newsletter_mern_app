const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// What should happen when client tries to GET data FROM our server
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

// What should happen when client tries to POST data TO our server
app.post("/", function(req, res){
    const firstName = req.body.fName;
    const secondName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: secondName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = 'https://us10.api.mailchimp.com/3.0/lists/64a561a190';

    const options = {
        method: "POST",
        auth: "reuben:10310073adc5ec8a8ce3f0323bb38cffa-us10"
    };
    
    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});

//mailchimp API: 0310073adc5ec8a8ce3f0323bb38cffa-us10

//audience ID: 64a561a190