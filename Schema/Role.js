const mongoose=require('mongoose')
const role=new mongoose.Schema({
    name:{type:String},
    permissions:[type=String]
})
module.exports=mongoose.model('Role',role)