const imgModel=require('./models/db');

const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose')

var app = express();
var fs = require('fs');
var path = require('path');
require('dotenv/config');
var multer = require('multer');
const e = require('express');
// var imgModel = require('./model'); 
const ImgModel = mongoose.model('Image');
const UserModel=mongoose.model('users');
var islog=false;
var userx=null;
var emailx=null;
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

// const storagel = require('node-persist');
 
// //you must first call storage.init
// // await storage.init( /* options ... */ );
// storagel.setItem('name','yourname')
// console.log(storagel.getItem('name')); // yourname


app.set('view-engine', 'ejs');
app.get('/', (req, res) => {
    ImgModel.find((err, docs) => {
        if (!err) {
            if(islog){
                res.render('index.ejs', {
                    list: docs,mans:userx
                });
            }
            else{
                console.log(userx,islog);
                res.render('index.ejs', {
                    list: docs
                });

            }
        }
        else {
            console.log("error in fetching list");
        }
    })
});

app.get('/admin', (req, res) => {
    res.render('admin.ejs');
});
app.get('/contact', (req, res) => {
    res.render('contact.ejs');
});

app.get('/signup',(req,res)=>{
    res.render('signup.ejs');
})
app.get('/login',(req,res)=>{
    res.render('login.ejs');
})
app.get('/about',(req,res)=>{
    res.render('about.ejs');
})
app.get('/profile',(req,res)=>{
    res.render('profile.ejs',{u:userx,e:emailx});
})
app.get('/cart',(req,res)=>{
    res.render('cart.ejs')
})
app.get('/info',(req,res)=>{
    // console.log(req.query.topic);
    ImgModel.find({_id:req.query.topic},(err, docs) => {
        if (!err) {
                // console.log(docs);
                res.render('info.ejs',{prod:docs});
        }
        else {
            console.log("error in fetching list");
        }
    })
})
app.get('/logout',(req,res)=>{
    userx=null;
    islog=false;
    res.redirect("/");
})

app.post('/profile',(req,res)=>{
    res.render('profile.ejs')
})

app.post('/admin',upload.single('image'), (req, res, next) => {
    try{
        var prod=new ImgModel();
        prod.prodname=req.body.prodname,
        prod.desc=req.body.desc,
        prod.mrp=req.body.mrp,
        prod.category=req.body.cat,
        prod.img= { 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            contentType: 'image/png'
        } 
        prod.save();
        console.log("successfully entered");
    }
    catch(error){
        console.log(error);
    } 
    res.redirect('/admin');
});


app.post('/signup',(req,res)=>{
    if(req.body.password1!=req.body.password2){
        res.render("signup.ejs",{errors:"password doesnot matched"});
    }
    else{
        UserModel.find({email:req.body.email},(err, docs) => {
            if(docs[0]!=undefined){
                res.render("signup.ejs",{errors:"user already existed"});
            }
            else{
                var user = new UserModel({
                    username: req.body.username,
                    email:req.body.email,
                    password:req.body.password1
                  });
                    user.save(function(err) {
                        if (err) {
                          console.log("something went wrong");
                          res.render("signup.ejs",{errors:"user already existed"});
                        }
                        else{
                            console.log(req.body.username);
                            userx=req.body.username;
                            emailx=req.body.email;
                            islog=true;
                            res.redirect('/')
                        }
                      });
            }
        });
    }
});


app.post('/login',(req,res)=>{
    try{
        UserModel.find({email:req.body.email},(err, docs) => {
            if(docs[0]==undefined){
                res.render("login.ejs",{errors:"user doesnot exist"});
                console.log("user doesnot exist");
            }
            else if (!err) {
                if(docs[0].password==req.body.password){
                    console.log("login successfull");
                    console.log(docs[0].username);
                            userx=docs[0].username;
                            emailx=req.body.email
                            islog=true;
                            res.redirect("/");
                }
                else{
                    res.render("login.ejs",{errors:"incorrect password or email"});
                    console.log("password incorrect");
                }
            }
            else {
                console.log("error in fetching list");
            }
        });
    }
    catch(err){
        console.log(err);
    }
    
});



app.listen( process.env.PORT ||3000,() => {
    console.log("Server started at 3000");
})