//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose  = require('mongoose');
const encrypt = require("mongoose-encryption");
require('dotenv').config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Ambuj123:Ambuj123@cluster1.cski6.mongodb.net/blogDB",{useNewUrlParser: true});



//Post Schema
const postSchema = {
 title: String,
 content: String,
 author :String
};

const Post = mongoose.model("Post", postSchema);








//Users Schema
/*
const userSchema = new mongoose.Schema({
  name : String,
  mobile:String,
  email:String,
  password:String
});

const SECRET = "This is ambuj Mishra"; 

userSchema.plugin(encrypt,{secret:SECRET, encryptedFields:["password"]});
*/


const userSchema = {
name :String,
mobile:String,
email:String,
password:String
};
const User = new mongoose.model("User",userSchema);




app.get("/", function(req, res){
  Post.find({}, function(err, posts){
     res.render("home", {
       startingContent: homeStartingContent,
       posts: posts
       });
   })
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("login");
});

//Write Post
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    author :req.body.postAuthor
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});





app.get("/posts/:postId", function(req, res){
    const requestedPostId = req.params.postId;
    Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
     title: post.title,
     content: post.content
   });
 });
});

//Login

app.get("/login", function(req, res){
  User.find({},function(err,users){
      res.render("login");
  });
});





app.get("/register",function(req,res)
{
  res.render("register");
});




//Register User
app.post("/register", function(req, res){
  const user = new User({
    name:req.body.fullname,
    mobile:req.body.mobileno,
    email: req.body.username,
    password: req.body.password
  });
  user.save(function(err){
    if (!err){
      res.redirect("/compose");
    }
  });
});


//Login User
app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
      res.send(err);
            }
    else{
      if(foundUser){
        if(foundUser.password === password)
        {res.render("compose");}
        else{
          res.write("Password is wrong");
          res.end();
           }
        }
      else{
        res.send("Email is wrong");
      }

        }
  });

});




app.get("/admin",function(req,res){
  res.render("adminlogin");
});




//message schema
const msgSchema = {
  name: String,
  email: String,
  phone :String,
  msg:String
 };
 
 const Message = mongoose.model("Message", msgSchema);





 app.post("/contactmsg", function(req, res){
  const msg = new Message({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    msg :req.body.msg
  });

  msg.save(function(err){
    if (!err){
      res.redirect("/");
    }
    else{
      res.send(err);
    }
  });
});


















//Login as Admin

app.post("/admin", function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  if(username === process.env.EMAIL && password === process.env.PASSWORD){
    User.find({},function(err,users){
      Post.find({},function(err,posts){
        Message.find({},function(err,messages){
          res.render("userdetails",{
            users:users,
            posts: posts,
            messages:messages
        });
       
       });
      });
      
    });
  }
  else{
	  console.log("Invalid User");
  }
});

//Delete User By Admin
app.post("/delete",function(req,res){
   const user_id = req.body.id;
     
User.findByIdAndRemove(user_id, function (err, docs) { 
    if (err){ 
        console.log(err);
    } 
    else{ 
      User.find({},function(err,users){
        Post.find({},function(err,posts){
          Message.find({},function(err,messages){
            res.render("userdetails",{
              users:users,
              posts: posts,
              messages:messages
          });         
         });
        });
        
      });
    } 
  });   
});

//Delete Post by admin
app.post("/deletepost",function(req,res){
  const post_id = req.body.postid;
     
Post.findByIdAndRemove(post_id, function (err, docs) { 
   if (err){ 
       console.log(err);
   } 
   else{ 
     User.find({},function(err,users){
       Post.find({},function(err,posts){
        Message.find({},function(err,messages){
          res.render("userdetails",{
            users:users,
            posts: posts,
            messages:messages
        });       
       });
       });
       
     });
   } 
 });
  
});



//Delete Message by Admin
app.post("/deletemsg",function(req,res){
  const msg_id = req.body.msgid;
     
Message.findByIdAndRemove(msg_id, function (err, docs) { 
   if (err){ 
       res.send(err);
   } 
   else{ 
     User.find({},function(err,users){
       Post.find({},function(err,posts){
        Message.find({},function(err,messages){
          res.render("userdetails",{
            users:users,
            posts: posts,
            messages:messages
        });       
       });
       });
       
     });
   } 
 });
  
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
;


app.listen(port, function() {
  console.log("Server has started ");
});
