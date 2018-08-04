/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _______Yue Chen_________ Student ID: ___150612166___ Date: ____Aug 3,2018____
*
*  Online (Heroku) Link: _____   https://yue-chen-web322-assignment.herokuapp.com/   __________
*
********************************************************************************/ 

const HTTP_PORT = process.env.PORT||8080;
const express = require('express');
const app = express();
const path = require("path");
const dataservice = require("./data-service.js");
const dataServiceAuth = require("./data-service-auth.js");
const fs = require('fs');
const bodyParser = require("body-parser");
const multer = require("multer");
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions");
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(clientSessions({
    cookieName: "session",
    secret:"web322_a6",
    duration: 2*60*1000,
    activeDuration: 60*1000
}));
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
app.engine('.hbs', exphbs({ extname:'.hbs', defaultLayout:'main',
    helpers:{
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
}}));
app.set('view engine', '.hbs');
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

// call this function after the http server star
function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
};

function ensureLogin (req, res, next){
    if (!(req.session.user)){
        res.redirect("/login");
    }
    else{
        next();
    }
}

// GET -----------------------------------------
// setup a 'route' to home
app.get("/",(req,res)=>{
    res.render('home');
});
// setup a 'route' to home 
app.get("/home",(req,res)=>{
    res.render('home');
});
// setup a 'route' to about
app.get("/about",(req,res)=>{
    res.render('about');
});

// GET/POST LOG -------------------------------------
app.get("/login", (req,res)=>{
    res.render("login");
});
app.post("/login", (req, res)=>{
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body)
    .then((get_user)=>{
        req.session.user = {
            userName: get_user.userName,
            email: get_user.email,
            loginHistory: get_user.loginHistory
        };
        res.redirect('/employees');       
    })
    .catch((err)=>{
        res.render("login",{errorMessage: err, userName: req.body.userName} );
    });
});
app.get("/register", (req,res)=>{
    res.render("register");
});
app.post("/register", (req,res)=>{
    dataServiceAuth.registerUser(req.body)
    .then(()=>{
        res.render("register", {successMessage: "User created"});
    })
    .catch((err)=>{
        res.render("register",{errorMessage: err, userName: JSON.stringify(req.body.userName)});
    })
});
app.get("/logout", (req, res)=>{
    req.session.reset();
    res.redirect("/");
})
app.get("/userHistory", ensureLogin, (req, res)=>{
    res.render("userHistory",{user: req.session.user});
});

// Get datas  -----------------------------------------
// setup a 'route' to get image data
app.get("/images", ensureLogin, (req,res) =>{
    fs.readdir("./public/images/uploaded", function(err, data) {
        res.render('images',{images:data}); 
    });
});

// setup a 'route' to get employees data
app.get("/employees", ensureLogin, (req,res,Employees)=>{
    if (req.query.status){
        dataservice.getEmployeesByStatus(req.query.status) 
        .then((data)=>{
            if (data.length>0)
                res.render("employees",{Employees:data});
            else
                res.render("employees",{ message: "no results" });
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        })
    }  
    else if (req.query.department){
        dataservice.getEmployeesByDepartment(req.query.department)
        .then((data)=>{
            if (data.length>0)  res.render("employees",{Employees:data});
            else res.render("employees",{ message: "no results" });
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        })
    }   
    else if (req.query.manager){
        dataservice.getEmployeesByManager(req.query.manager)
        .then((data)=>{
            if (data.length>0)  res.render("employees",{Employees:data});
            else res.render("employees",{ message: "no results" });
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        })
    }
    else{
        dataservice.getAllEmployees()
        .then((data)=>{
            res.render("employees",{Employees:data});
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        });
    }
})

// setup a 'route' to get employees by empNum
app.get("/employee/:num", ensureLogin, (req,res,data)=>{
    let viewData = {};
    var num = req.params.num;
    dataservice.getEmployeeByNum(num)
    .then((data)=>{
        if (data) {
            viewData.employee = data;
        } 
        else {
            viewData.employee = null;
        }
    })
    .catch(() => {
        viewData.employee = null;
    })
    .then(dataservice.getDepartments) 
    .then((data) => {
        viewData.departments = data;
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
    })
    .catch(() => {
        viewData.departments = [];
    })
    .then(() => {
        if (viewData.employee == null) {
            res.status(404).send("Employee Not Found");
        } 
        else {
            res.render("employee", { viewData: viewData });
        }
    })
    .catch(()=>{
        res.status(500).send("Unable to get Employee");
    })
});

// setup a 'route' to get departments data
app.get("/departments", ensureLogin, (req,res,Departments)=>{
    dataservice.getDepartments()
    .then((data)=>{
        if (data.length > 0) res.render("departments", {Departments: data});
        else res.render("departments",{message: "no results"});
    })
    .catch(()=>{
        res.render("departments",{message: "no results"});
    });
})

// setup a 'route' to get departments by Id
app.get("/department/:num", ensureLogin, (req,res)=>{
    var num = req.params.num;
    dataservice.getDepartmentById(num)
    .then((data)=>{
        res.render("department",{department:data}); 
    })
    .catch(()=>{
        res.status(404).send("Department Not Found"); 
    });
})

// GET CRUD -----------------------------------------
// setup a get 'route' to display add employee web site
app.get("/employees/add", ensureLogin, (req,res,Departments)=>{
    dataservice.getDepartments()
    .then((data)=>{
        res.render("addEmployee", {Departments: data});
    })
    .catch(()=>{
        res.render("addEmployee", {Departments: []}) 
    });
});

// setup a get 'route' to delete employee by empNum
app.get("/employees/delete/:num", ensureLogin, (req,res)=>{
    var num = req.params.num;
    dataservice.deleteEmployeeByNum(num)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(500).send("Unable to Remove Employee / Employee not found)");
    })
});

// setup a get 'route' to display add department web site
app.get("/departments/add", ensureLogin, (req,res)=>{
    res.render('addDepartment');
});

// setup a get 'route' to display add image web site
app.get("/images/add", ensureLogin, (req,res)=>{
    res.render('addImage');
});

// POST -----------------------------------------
// setup a post 'route' to add employees
app.post("/employees/add", ensureLogin, (req, res, Employees) => {
    dataservice.addEmployee(req.body) 
    .then((Employees)=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        console.log("unable to add employee");
    });
});

// setup a post 'route' to update employees
app.post("/employee/update", ensureLogin, (req, res) => {
    dataservice.updateEmployee(req.body)
    .then(()=>{res.redirect("/employees");})
    .catch(()=>{res.status(500).send("Unable to Update Employee");});
});

// setup a post 'route' to add department
app.post("/departments/add", ensureLogin, (req, res,Employees) => {
    dataservice.addDepartment(req.body) 
    .then((Employees)=>{
        res.redirect("/departments");
    })
    .catch(()=>{
        console.log("unable to add department");
    });
});

// setup a post 'route' to update department
app.post("/department/update", ensureLogin, (req, res) => {
    dataservice.updateDepartment(req.body)
    .then(()=>{res.redirect("/departments");})
    .catch( ()=>{
        res.status(500).send("Unnable to update department");
    })
});

// setup a post 'route' to add image
app.post("/images/add", ensureLogin, upload.single(("imageFile")), (req, res) => {
    res.redirect("/images");
});

// no matching route
app.use((req,res)=>{
    res.status(404).send("Page Not Found");
})

// setup http server to listen on HTTP_PORT 
dataservice.initialize()
    .then(dataServiceAuth.initialize)
    .then(()=>{app.listen(HTTP_PORT, onHttpStart);})
    .catch((err)=>{console.log("unable to start server: " + err);});