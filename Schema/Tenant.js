const mongoose=require('mongoose')
const tenant=new mongoose.Schema({
    tenant_name:{
        type:String
    },
    admin_mail:{
        type:String
    },
    password:{
        type:String
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Tenant',tenant)