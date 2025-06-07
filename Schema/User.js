const mongoose=require('mongoose')
const Tenant = require('./Tenant')
const user=new mongoose.Schema({
    tenant_id:{
        type:String,
        ref:Tenant
    },
    user_name:{
        type:String
    },
    user_email:{
        type:String
    },
    user_password:{
        type:String
    },
    role:{
        type:String,
        enum:['Admin','Manager','Viewer'],
        default:'Viewer'
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('User',user)