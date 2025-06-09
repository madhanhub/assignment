**Tenant and User Management**

      •	This backend project has implemented tenant and user management with role- base control using Node.js ,Express.js 
      •	MongoDB and JsonWebToken(JWT) for Authentication

      •	Tenants have their own users and they are assigned roles like 'Admin' ,'Manager' and Viewer each and every user has specific operations. Backend gives secret login with authentication for CRUD operations 

**Step and Setup** :

      •	create folder name with Tenant and management

      •	create index.js file as an main file

      •	In command prompt :start npm(Node Package Manager)

      •	npm init 

      •	install proper dependences using npm Eg:(npm install express)

      •	dependences are :
                    •	express ' assign express to some variable because express framework cannot use directly'
                    •	mongoose
                    •	Body-parser
                    •	morgan
                    •	CORS
                    •	jsonwebtoken
                    •	dotenv



      •	create folder schema and create file Tenant.js, User.js, Role.js, Project.js

      •	create folder as function create files in function folders are auth.js and cors.js for authentication logic 
      •	All dependencies are import using 'require' eg const express=require('express')
      
      •	Once required all dependencies it has to be used Eg (app.use(express.json())
      
      •	after all install are dependences create port with unique four digit number like (8888) using app.listen

      •	Connect with database using mongoose  
      
      •	MongoDB is your database 
      
      •	write welcome route for check working of port and proper database connection
      
      •	then write proper routes
      
      •	open terminal and select command prompt
      
      •	cd proper folder 
      
      •	RUN COMMAND : node index.js

**Postman :**

      •	Postman is used for testing routes 
      •	Create a collection and give http with proper api with suitable Method 
      •	It checks api and return proper response from postman



**Technologies and Frameworks are used in:**

      •	Backend Framework : Express.js
      •	Data Base	  : MongoDB with Mongoose
      •	Authentication 	  : Jsonwebtoken , CORS
      •	Utilities	  : Morgan ,Body-parser ,Dotenv

**Schemas :**

      •	Tenant -  tenant_name, admil_mail, password ,createAt
      •	User   -  tenant_id,user_name,user_email, user_password, role, createAt
      •	Role   -  name, permission
      •	project-  tenant_id, manager_id, name, description, status, createAt

**Modules and Endpoints**

**Tenant**


    •	1) Tenant register :
            •	Method POST : api/tenant/register 
            •	`		Create new Tenant with tenant_name, admil_mail, password ,createAt
            •	With checks existing user
            •	Requirements : tenant_name, admil_mail, password ,createAt

    •	2) Tenant Login    :
            •	Method POST  : api/tenant/login
            •	Provide secure login with jwt token
            •	It return header with token, unique id, tenant name, tenant mail
            •	Requirements : admin_mail, password
            
    •	3) Tenant Delete   : 
            •	Method DELETE: api/tenant/delete
            •	It used to delete existing tenants with proper authorization 
            •	It delete tenant with check tenant_id using token
            •	Requirements : tenant_id 
            
    •	4) Tenant Update   : 
            •	Method PUT: api/tenant/update
            •	It update existing tenant details with the help of tenant_id 
            •	Token header contain tenant_id for proper security checks
            •	Requirements : tenant_name, admin_mail, password
            
    •	5) Tenant View     : 
            •	Metho GET: api/tenant/view
            •	Use to list all tenants in your DataBase
            •	Requirements : tenant_id, 

**User**

       1) User Register  :
          •	Method POST : api/tenant/user
          •	It create new user for tenant with specific role base 
          •	Checks unique user 
          •	Requirement : tenant_id,user_name,user_email,user_password,role

    •	2) User Login     : 
          •	Method POST : api/auth/login
          •	Provide proper secure login with jwt token
          •	It return header with token, user unique id, user_name, role, tenant_id
          •	Requirements : user_email, password

    •	3) User Delete    : 
          •	Method DELETE: api/tenant/user/delete
          •	Use to delete users with the help of user_id
          •	It need authorization for remove existing user
          •	Requirements : user_id
          
  •	 4) User Update    :
          •	Method PUT : api/tenant/user/update 
          •	Update existing data of users using proper validation 
          •	Requirements : _id,user_name,user_email,user_password,role
          

  •	 5) Uesr View     :
          •	Method GET  : api/tenant/user/view
          •	It is used to list the user in your DataBase
          •	Requirements : user_id
          

**Project**


    1) Create Project:
          •	Method POST : api/tenant/project
          •	It create new project with proper requirements 
          •	Requirements : tenant_id, manager_id, name, description, status ,createAt

    2) Delete Project:
          •	Method DELETE : api/tenant/project/delete
          •	Delete non usable existing from database
          •	requirements : project_id

    3) Update Project: 
          •	Method PUT : api/tenant/project/update
          •	Update specific field of project details 
          •	Requirements: tenant_id, manager_id, name,description,status  

    4) Project View :
          •	Method GET : api/tenant/project/view
          •	List entire project from database
          •	Requirements: project_id

**Role**

     1) Role :	
          •	Method POST :  api/user/roles
          •	It gives specific roles for each user dependence on tenant
          •	Requirements : name, permission 

**Authorization and Middlewares :**

          •	Use jsonwebtoken for authenticate users and tenants for handle project, updates 
          •	Every routes has authentication for CRUD operations 
          •	Token header contain tenant_id,user_name,admin_mail,user_name,user_id

**Error Handling :**

          •	Try catch blocks are used for error handling 
          •	It return proper status code like (200, 500, 404, 400,401)
          •	It checks existing user and unauthorized users

**MongoDB :** 

          •	Use mongoDB queries for find filter update and delete like (find ,findOne, findOneAndUpdate, findOneAndDelete)
          •	It store data in json formate in key value pair, token formate is beared toker
          




