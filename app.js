//jshint esversion:6

//for keeping the secure info in .env file
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/UserDB");

const userSchema = new mongoose.Schema({
  email:String,
  password: String
});
// to access the SECRET value  in .env file  use process.env.SECRET
userSchema.plugin(encrypt,{secret:process.env.SECRET , encryptedFields: ['password']});



const User = new mongoose.model("User" , userSchema);

app.get("/" , function(req , res){
  res.render("home");
});
app.get("/register" , function(req , res){
  res.render("register");
});
app.get("/login" , function(req , res){
  res.render("login");
});


app.post("/register" , function(req , res ){
 const username = req.body.username;
 const password =req.body.password;
   const newUser = new User({
     email: username,
     password :password
   });
   newUser.save(function(err){
     if(err){
       res.send(err);
     } else {
       res.render("secrets");
     }
   });
});

app.post("/login" , function(req , res){

   User.findOne({email: req.body.username }, function(err ,founduser){
     if(err){
       res.send(err);
     }else {
       if(founduser){
         if(founduser.password === req.body.password){
           res.render("secrets");
         }
       }
     }
   });

});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
