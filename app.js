//jshint esversion:6
require("dotenv").config();
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const bcrypt = require("bcrypt")
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost:27017/UserDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret: secret, encryptedFields:["password"]})


const User = new mongoose.model("User",userSchema)

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash 
        })
        newUser.save((e)=>{
            if(!e){
                res.render("secrets");
            }else{
                console.log(e)
            }
        })
    });
})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username},(err,data)=>{
        if(!err){
            if(data){
                bcrypt.compare(password, data.password, function(err, result) {
                    // result == true
                    if(result){
                        res.render("secrets")
                    }else{
                        console.log("wrong password")
                    }
                });
            }else{
                console.log("data not getting")
            }
        }else{
            console.log(err);
        }
    })
})

app.listen(1000,function(){console.log("Server started on http://localhost:1000")})