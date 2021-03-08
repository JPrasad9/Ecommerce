const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Ecommerce:Ecommerce@cluster0.xsufp.mongodb.net/<dbname>?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology: true},(err)=>{
    if(!err){
        console.log("mangodb connected successfull")
    }else{
        console.log(err)
    }
});

require('./product.model');