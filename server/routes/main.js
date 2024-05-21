const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get("", async (req, res) => {
    try { 


        const locals={
            title:"My Blog",
            description:"Welcome to my blog!",
    
        }
        let perPage=10;
        let page=req.query.page || 1;
    
        const Mydata= await Post.aggregate([{ $sort: { createdAt: -1 } }, { $skip: (perPage * page) - perPage }, { $limit: perPage }]);
    
        const count= await Post.countDocuments({});
        const nextPage=parseInt(page)+1;
        const CnextPage=nextPage<=Math.ceil(count/perPage);
    
    
        res.render("index",{
            locals,
            data:Mydata,
            current:page,
            nextPage:CnextPage? nextPage:null,
            currentRoute:"/"
        });
    } catch (error) {
        console.log(error);
    }
    
    });


router.get("/post/:id", async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.findById(req.params.id);
        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
          }
        res.render('post', { 
            locals,
            data,
            currentRoute: `/post/${slug}`
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/search', async (req, res) => {
    try {
      const locals = {
        title: "Search",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
      const data = await Post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        data,
        locals,
        currentRoute: '/'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });
  

router.get('/about', (req, res) => {
    res.render('about', {
      currentRoute: '/about'
    });
  });


module.exports = router;
