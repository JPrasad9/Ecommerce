var mongoose = require('mongoose'); 
  
var imageSchema = new mongoose.Schema({ 
    prodname: String, 
    desc: String,
    mrp:String,
    category:String, 
    img: 
    { 
        data: Buffer, 
        contentType: String 
    } 
}); 
  
//Image is a model which has a schema imageSchema 
  
module.exports = new mongoose.model('Image', imageSchema); 

var UserSchema=new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    }
});

module.exports = new mongoose.model('users',UserSchema);