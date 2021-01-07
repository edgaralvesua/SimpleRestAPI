const express = require("express");
const ejs = require ("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const Article = mongoose.model('Article', {
  tittle: String,
  content: String
});

app.route("/articles")

.get(function(req,res){
  Article.find({}, function(err,articles){
    if(!err){
      res.send(articles);
    }else{
      res.send(err);
    };
  });
})

.post(function(req,res){
  const newArticle = new Article({
    tittle: req.body.tittle,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Sucess")
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Deleted with sucess");
    }else{
      res.send(err);
    };
  });
});

//Requests handling Single Articles

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({tittle:req.params.articleTitle}, function(err,articleFound){
    if(!err){
      res.send(articleFound);
    }else{
      res.send(err);
    };
  });
})
//Used to Update all the of the params
.put(function(req,res){
  Article.update(
    {tittle:req.params.articleTitle},
    {tittle: req.body.tittle, content:req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Updated com sucess");
      }else{
        res.send(err);
      };
    });
})
//Used to Update some of the params
.patch(function(req,res){
  Article.update(
    {tittle:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Updated with sucess");
      }else{
        res.send(err);
      };
    });
})

.delete(function(req,res){
  Article.deleteOne({tittle:req.params.articleTitle}, function(err){
    if(!err){
      res.send("Deleted with sucess");
    } else {
      res.send(err);
    };
  });
});


app.listen(3000, function(){
  console.log("Server Started on Port 3000.");
});
