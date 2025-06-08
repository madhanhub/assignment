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
const Role=require('./Schema/Role')
const project=require('./Schema/Project')
const authorization=require('./Function/auth')
const cors=require('./Function/cors')
const { permission } = require('process')

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

//TENANTS

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
        res.status(200).json({message:'New Tenant Added ',data:tenant_reg})
    }catch(error){
        res.status(500).json({message:"New Tenant Addition Failed"})
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

                res.status(200).json({message:'Tenant Login Successfully',tenant_token,data:tenant_login})
            }
        }

        
    }catch(error){
        res.status(500).json({message:'Logain Failed'})
    }
})

app.delete('/api/tenat/deleted',authorization,async(req,res)=>{
    try{
        const _id=req.id
        const tenant_delete=await tenant.findOneAndDelete({_id})
        res.status(200).json({message:'Tenant Deleted Successfully',data:tenant_delete})
    }catch(error){
        res.status(500).json({message:'Tenant Still Here'})
    }
})

app.get('/api/tenant/fetch',async(req,res)=>{
    try{
        const user_fetch=await tenant.find({})
        res.status(200).json({message:'Tenant Are',data:user_fetch})
    }catch(error){
        res.status(500).json({message:'Un able to fetch'})
    }
})

app.put('/api/tenant/update',authorization,async(req,res)=>{
    try{
        const {admin_mail,password}=req.body
        const _id=req.id
        const tenant_update=await tenant.findOneAndUpdate({_id},
            {$set:{
                admin_mail,password
            }}
        )
        res.status(200).json({message:'Tenant Update Successfully',data:tenant_update})
    }catch(error){
        res.status(500).json({message:'Tenant not updated'})
    }
})

//USERS

app.post('/api/tenant/user',async(req,res)=>{
    try{
        const {tenant_id,user_name,user_email,user_password,role}=req.body

        const existing_user=await user.findOne({user_email})
        if(existing_user){
            return res.status(400).json({message:'User Already Exist'})
        }
        const newUser=new user({
            tenant_id,user_name,user_email,user_password,role
        }).save()
        res.status(200).json({message:'User Registered',data:newUser})
    }catch(error){
        res.status(500).json({message:'Registration Failed'})
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
            

               res.status(200).json({message:'success',token,data:user_login})
               console.log(user_login);
               
            }
        }
         
        
    }catch(error){
        res.status(500).json({message:"failed"})
    }
})


app.get('/api/tenant/user/viewer',async(req,res)=>{
    try{
        const user_view=await user.find({})
        res.status(200).json({message:'User are',data:user_view})
    }catch(error){
         res.status(500).json({message:"something wrong",error})
    }
})

app.delete('/api/tenant/user/delete',authorization,async(req,res)=>{
    try{
        _id=req.id
        const user_delete=await user.findOneAndDelete({_id})
        res.status(200).json({message:'User Deleted',data:user_delete})
    }catch(error){
         res.status(500).json({message:"User Still Here",error})
    }
})

app.put('/api/tenant/user/update',authorization,async(req,res)=>{
    try{
        const {user_name,user_email,user_password,role}=req.body
        _id=req.id
        const user_update=await user.findOneAndUpdate({_id},
            {$set:{
                user_name,user_email,user_password,role
            }}   
        )
        res.status(200).json({message:'User Update Successfully',data:user_update})
    }catch(error){
        res.status(500).json({message:'User Updation Failed'})
    }
})
//PROJECT


app.post('/api/tenant/project',authorization,async(req,res)=>{
    try{
        const {manager_id,name,description}=req.body
        const tenant_id=req.id
        const tenant_project=new project({
            manager_id,tenant_id,name,description
        }).save()
        res.status(200).json({message:'Project add successfully',data:tenant_project})
    }catch(error){
         res.status(500).json({message:"something wrong",error})
    }
})

app.put('/api/tenant/project/update',authorization,async(req,res)=>{
    try{
        const {name,description,status}=req.body
        const tenant_id=req.id
        const project_update=await project.findOneAndUpdate({tenant_id},
            {$set:{
                name,description,status
            }}
        )
        res.status(200).json({message:'project updated',data:project_update})
    }catch(error){
         res.status(500).json({message:"something wrong",error})
    }
})


app.delete('/api/tenant/project/delete',authorization,async(req,res)=>{
    try{
        const tenant_id=req.id
        const project_delete=await project.findOneAndDelete({tenant_id})

        res.status(200).json({message:'projected Deleted',data:project_delete})
    }catch(error){
         res.status(500).json({message:"something wrong",error})
    }
})

app.get('/api/tenant/project/view',async(req,res)=>{
    try{
        // const {}=req.body
        const project_view=await project.find({})

        res.status(200).json({message:'projected List',data:project_view})
    }catch(error){
         res.status(500).json({message:"something wrong",error})
    }
})
//ROLES

app.post('/api/user/roles',async(req,res)=>{
        try{
            //const {name}=req.body
            const roles=[
                {name:'admin',permissions:['create', 'read', 'update', 'delete']},
                {name:'manager',permissions:['create', 'read', 'update',]},
                {name:'viewer',permissions:['read']}
            ]
            const user_roles=['admin']
            for(const role of roles){
                    const save=await Role.findOneAndUpdate({
                        name:role.name
                    },role,{new:true,upsert:true}) 
                    user_roles.push(save)
            }
        
            res.status(200).json({message:'success',data:user_roles})
        }catch(error){
            res.status(500).json({message:"something wrong",error})
        }
})


