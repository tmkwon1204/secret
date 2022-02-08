
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const Schema = mongoose.Schema;
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save((err)=> {
      if (!err){
          console.log("new user has been registered.")
          res.render("secrets");
      }else{
          console.log(err)
      }
  })
});

app.post("/login",(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if (err){
            console.log(err);
        }else {
            if (foundUser.password === password){
              res.render("secrets");
            }
        }
    })
})
app.get("/logout", function(req, res){
    res.redirect("/");
})
app.listen(3000, function(){
    console.log("Server start on port 3000.");
})