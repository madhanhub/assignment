const mongoose=require('mongoose')
const Tenant = require('./Tenant')
const User = require('./User')
const project=new mongoose.Schema({
    tenant_id:{type:String,ref:Tenant},
    manager_id:{type:String,ref:User},
    name:{type:String},
    description:{type:String},
    status:{type:String,
        default:'Active'},
    createAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Project',project)