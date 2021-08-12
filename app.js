//jshint esversion:6
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost:27017/UserDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const userSchema = {
    email: String,
    password: String
}
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
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((e)=>{
        if(!e){
            res.render("secrets");
        }else{
            console.log(e)
        }
    })
})
app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username},(err,data)=>{
        if(!err){
            if(data){
                if(data.password === password){
                    res.render("secrets")
                }
            }
        }else{
            console.log(err);
        }
    })
})

app.listen(1000,function(){console.log("Server started on http://localhost:1000")})