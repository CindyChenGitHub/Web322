/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _______Yue Chen_________ Student ID: ___150612166___ Date: ____June 15,2018____
*
*  Online (Heroku) Link: _____   https://yue-chen-web322-assignment.herokuapp.com/   __________
*
********************************************************************************/ 

const HTTP_PORT = process.env.PORT||8080;
const express = require('express');
const dataservice = require("./data-service.js");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const fs = require('fs');
const multer = require("multer");
const exphbs = require("express-handlebars");


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }) );
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
// call this function after the http server star
function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
};
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      // we write the filename as the current date down to the millisecond
      // in a large web service this would possibly cause a problem if two people
      // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
      // this is a simple example.
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

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


// Get datas  -----------------------------------------
// setup a 'route' to get image data
app.get("/images", (req,res) =>{
    fs.readdir("./public/images/uploaded", function(err, data) {
        //res.status(200).json({"images":data});
        res.render('images',{images:data}); 
    });
});
// setup a 'route' to get employees data
app.get("/employees",(req,res,Employees)=>{
    console.log("in app.get /employees, query.length: " + req.query.length);
    console.log("in app.get /employees, Employees.length: " + Employees.length);
        if (req.query.status){
            dataservice.getEmployeesByStatus(req.query.status) 
            .then((data)=>{
                if (data.length>0)  res.render("employees",{Employees:data});
                else res.render("employees",{ message: "no results" });
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
                console.log("in else, getAllEmployees.then, data: " + data)
                res.render("employees",{Employees:data});
                //else res.render("employees",{ message: "no results" });
            })
            .catch(()=>{
                console.log("in first catch");
                res.render("employees",{message: "no results"});
            });
        }
})
// setup a 'route' to get employees by empNum
app.get("/employee/:num",(req,res)=>{
    var num = req.params.num;
    dataservice.getEmployeeByNum(num)
    .then((data)=>{
        res.render("employee", {employee:data});
        //else res.status(404).send("Employee Not Found");
    })
    .catch(()=>{
        res.status(404).send("Employee Not Found"); 
        //res.render("employee",{message:"no results"}); 
    });
})
// setup a 'route' to get departments data
app.get("/departments",(req,res,Departments)=>{
    dataservice.getDepartments()
    .then((data)=>{
        console.log("in app.get /departments->then");
        if (data.length > 0) res.render("departments", {Departments: data});
        else res.render("departments",{message: "no results"});
    })
    .catch(()=>{
        console.log("in catch");
        res.render("departments",{message: "no results"});
    });
})
app.get("/department/:num",(req,res)=>{
    var num = req.params.num;
    dataservice.getDepartmentById(num)
    .then((data)=>{
        res.render("department",{department:data}); 
        //else res.status(404).send("Department Not Found");
    })
    .catch(()=>{
        res.status(404).send("Department Not Found"); 
    });
})
// GET ADD -----------------------------------------
// setup a get 'route' to display add employee web site
app.get("/employees/add",(req,res,Departments)=>{
    dataservice.getDepartments()
    .then((data)=>{
        console.log("in /employee/add rout ->then, data: " + data)
        res.render("addEmployee", {Departments: data});
    })
    .catch(()=>{
        res.render("addEmployee", {Departments: []}) 
    });
});
// setup a get 'route' to display add department web site
app.get("/departments/add",(req,res)=>{
    res.render('addDepartment');
});
// setup a get 'route' to display add image web site
app.get("/images/add",(req,res)=>{
    res.render('addImage');
});
// POST -----------------------------------------
// setup a post 'route' to add employees
app.post("/employees/add", (req, res, Employees) => {
    console.log("in /employees/add POST route");
    dataservice.addEmployee(req.body) 
    .then((Employees)=>{
        console.log("in /employees/add POST ->then");
        res.redirect("/employees");
    })
    .catch(()=>{
        console.log("unable to add employee");
    });
});
// setup a post 'route' to update employees
app.post("/employee/update", (req, res) => {
    dataservice.updateEmployee(req.body)
    .then(()=>{res.redirect("/employees");});
});
// setup a post 'route' to add department
app.post("/departments/add", (req, res,Employees) => {
    console.log("in /department/add POST route");
    console.log("req.body: "+ req.body);
    dataservice.addDepartment(req.body) 
    .then((Employees)=>{
        console.log("in /department/add POST ->then");
        res.redirect("/departments");
    })
    .catch(()=>{
        console.log("unable to add department");
    });
});
// setup a post 'route' to update department
app.post("/department/update", (req, res) => {
    dataservice.updateDepartment(req.body)
    .then(()=>{res.redirect("/departments");});
});
// setup a post 'route' to add image
app.post("/images/add", upload.single(("imageFile")), (req, res) => {
    res.redirect("/images");
});

// no matching route
app.use((req,res)=>{
    res.status(404).send("Page Not Found");
})
// setup http server to listen on HTTP_PORT 
dataservice.initialize()
    .then(()=>{app.listen(HTTP_PORT, onHttpStart);})
    .catch((err)=>{console.log("error: " + err);});