const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const mongoose=require('mongoose')
const morgan =require('morgan')
const path=require('path')
const http=require('http')

require('dotenv').config()
const jsonwebtoken=require('jsonwebtoken')


const tenant=require('./Schema/Tenant')
const user=require('./Schema/User')
const role=require('./Schema/Role')
const project=require('./Schema/Project')
const authorization=require('./Function/auth')
const cors=require('./Function/cors')

app.use(express.json())
app.use(bodyparser.json())
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(cors)

app.listen(8888,()=>{
    console.log('Server Run');

      mongoose.connect('mongodb://localhost:27017/')
    .then(()=>{
         conn= mongoose.connection
        console.log('DB Connected');
        
    })
    .catch(()=>{
        console.log('DB Not Connected');
        
    })
})

app.get('/',async(req,res)=>{
    res.send('welcomw')
})

app.post('/api/tenant/register',async(req,res)=>{
    try{
        const {tenant_name,admin_mail,password}=req.body

        const existing_Tenant=await tenant.findOne({tenant_name})
        if(existing_Tenant){
            return res.status(400).json({message:'tenat already exist'})
        }

        const tenant_reg=new tenant({
            tenant_name,admin_mail,password
        }).save()
        res.status(200).json({message:'success',data:tenant_reg})
    }catch(error){
        res.status(500).json({message:"failed"})
    }

})

app.post('/api/tenant/login',async(req,res)=>{
    try{
        const {admin_mail,password}=req.body
        const tenant_login=await tenant.findOne({admin_mail,password})
        if(tenant_login){
            {
                tenant_token=await jsonwebtoken.sign({id:tenant_login.id,tenant_name:tenant_login.tenant_name,admin_mail:tenant_login.admin_mail},process.env.SECRET)
                 res.setHeader('tenant_token',tenant_token)
                res.setHeader('id',tenant_login.id)
                res.setHeader('tenant_name',tenant_login.tenant_name)
                res.setHeader('admin_mail',tenant_login.admin_mail)

                res.status(200).json({message:'success',tenant_token,data:tenant_login})
            }
        }

        
    }catch(error){
        res.status(500).json({message:failed})
    }
})

app.delete('/api/tenat/user/deleted',authorization,async(req,res)=>{
    try{
        user_email=req.user_email
        const user_delete=await user.findOneAndDelete({user_email})
        res.status(200).json({message:'User Deleted Successfully',data:user_delete})
    }catch(error){
        res.status(500).json({message:'User Still here'})
    }
})

app.get('/api/tenant/user/fetch',async(req,res)=>{
    try{
        const user_fetch=await user.find({})
        res.status(200).json({message:'User Are',data:user_fetch})
    }catch(error){
        res.status(500).json({message:'Un able to fetch'})
    }
})

app.put('/api/tenant/user/update',async(req,res)=>{
    try{
        const {user_id,user_name,user_email,user_password,role}=req.body
        const user_update=await user.findOneAndUpdate({user_email},
            {$set:{
                user_name,user_email,user_password,role
            }}
        )
        res.status(200).json({message:'user update successfully',data:user_update})
    }catch(error){
        res.status(500).json({message:'User not updated'})
    }
})

app.post('/api/tenant/user',async(req,res)=>{
    try{
        const {tenant_id,user_name,user_email,user_password,role}=req.body
        const existing_user=await user.find({user_email})
        if(existing_user){
            return res.status(400).json({message:'user already exist'})
        }
        const new_user=new user({
            tenant_id,user_name,user_email,user_password,role
        }).save()
        res.status(200).json({message:'success',data:new_user})
    }catch(error){
         res.status(500).json({message:"failed"})
    }
})


app.post('/api/auth/login',async(req,res)=>{
    try{
        const {user_email,user_password}=req.body
        const user_login=await user.findOne({
            user_email,user_password
        })
        if(user_login){
            {
                let token= await jsonwebtoken.sign({id:user_login.id,user_name:user_login.user_name,user_email:user_login.user_email,tenant_id:user_login.tenant_id,role:user_login.role},process.env.SECRET)
                res.setHeader('token',token)
                res.setHeader('id',user_login.id)
                res.setHeader('user_name',user_login.user_name)
                res.setHeader('user_email',user_login.user_email)
                res.setHeader('role',user_login.role)
                res.setHeader('tenant_id',user_login.tenant_id)
            //    if(!user_login){
            //     return res.status(401).json({message:'unauthorized'})
            //    }

               res.status(200).json({message:'success',token,data:user_login})
               console.log(user_login);
               
            }
        }
         
        
    }catch(error){
        res.status(500).json({message:"failed"})
    }
})


app.get('/api/user/viewer',async(req,res)=>{
    try{
        const user_view=await user.find({})
        res.status(200).json({message:'User are',data:user_view})
    }catch(error){
         res.status(500).json({message:"something wrong",error})
    }
})
