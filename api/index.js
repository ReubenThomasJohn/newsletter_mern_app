const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// What should happen when client tries to GET data FROM our server

const dirname = path.resolve(__dirname, '..');
app.get("/", function(req, res){
    res.sendFile(dirname + "/signup.html");
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
    const api_key = process.env.API_KEY;
    const options = {
        method: "POST",
        auth: "reuben:" + api_key
    };
    
    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(dirname + "/success.html");
        } else {
            res.sendFile(dirname + "/failure.html");
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


app.listen(process.env.PORT || 3000 , function(){
    console.log("Server is running on port 3000.");
});

