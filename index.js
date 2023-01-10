//include required modules
const jwt = require('jsonwebtoken');
const config = require('./config');
const rp = require('request-promise');

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
let email, userid, resp;
const port = 3000;

//Use the ApiKey and APISecret from config.js which is .gitignore - will send you on whatsApp
const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, process.env.API_SECRET);


//get the form 
app.get('/', (req,res) => res.send(req.body));

//To get user info - change the [action] property in the <form> tag in public/index.html to be ---> /userinfo
app.post('/userinfo', (req, res) => {
    email = req.body.email;
  console.log(email);
  let options = {
    uri: "https://api.zoom.us/v2/users/"+email, 
    qs: {
        status: 'active' 
    },
    auth: {
        'bearer': token
    },
    headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
    },
    json: true 
};

rp(options)
    .then(function (response) {
        console.log('User has', response);
        resp = response
        let title1 ='<center><h3>Your token: </h3></center>' 
        let result1 = title1 + '<code><pre style="background-color:#aef8f9;">' + token + '</pre></code>';
        let title ='<center><h3>User\'s information:</h3></center>' 
        let result = title + '<code><pre style="background-color:#aef8f9;">'+JSON.stringify(resp, null, 2)+ '</pre></code>'
        res.send(result1 + '<br>' + result);
 
    })
    .catch(function (err) {
        console.log('API call failed, reason ', err);
    });


});

app.post("/newmeeting", (req, res) => {
    // hard-coded email of the zoom developer account
    email = "orental21@gmail.com"; 
    let options = {
      method: "POST",
      uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
      body: {
        topic: "test create meeting",
        type: 1,
        settings: {
          host_video: "true",
          participant_video: "true"
        }
      },
      auth: {
        bearer: token
      },
      headers: {
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json"
      },
      json: true 
    };
  
    rp(options)
      .then(function(response) {
        console.log("response is: ", response);
        res.send("create meeting result: " + JSON.stringify(response));
      })
      .catch(function(err) {
        console.log("API call failed, reason ", err);
      });
  });


app.listen(port, () => console.log(`Example app listening on port ${port}!`));