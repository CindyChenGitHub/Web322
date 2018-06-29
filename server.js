/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _______YC_________ Student ID: ___*****___ Date: ____June 15,2018____
*
*  Online (Heroku) Link: _____https://young-coast-16371.herokuapp.com/ __________
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

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }) );

// call this function after the http server star
function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
};

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
    res.sendFile(path.join(__dirname,"/views/home.html"));
});
app.get("/home",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/home.html"));
});
// setup a 'route' to about
app.get("/about",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/about.html"));
});
// setup a get 'route' to display add employee web site
app.get("/employees/add",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

// setup a get 'route' to display add image web site
app.get("/images/add",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

// Get datas  -----------------------------------------
// setup a 'route' to get image data
app.get("/images", (req,res) =>{
    fs.readdir("./public/images/uploaded", function(err, data) {
        res.status(200).json({"images":data});
    });
});
// setup a 'route' to get employees data
app.get("/employees",(req,res)=>{
    if (req.query.status){
        dataservice.getEmployeesByStatus(req.query.status) 
        .then((data)=>{
            res.status(200).json(data);
        })
        .catch(()=>{
            console.log("unable to get employees");
        })
    }  
    else if (req.query.department){
        dataservice.getEmployeesByDepartment(req.query.department)
        .then((data)=>{
            res.status(200).json(data);
        })
        .catch(()=>{
            console.log("unable to get employees");
        })
    }   
    else if (req.query.manager){
        dataservice.getEmployeesByManager(req.query.manager)
        .then((data)=>{
            res.status(200).json(data);
        })
        .catch(()=>{
            console.log("unable to get employees");
        })
    }   
    else{
        dataservice.getAllEmployees()
        .then((data)=>{
            res.status(200).json(data);
        })
        .catch(()=>{
            console.log("unable to get all employees");
        });
    }
})
// setup a 'route' to get employees by empNum
app.get("/employee/:num",(req,res)=>{
    var num = req.params.num;
    dataservice.getEmployeeByNum(num)
    .then((data)=>{
        res.status(200).json(data);
    })
    .catch(()=>{
        console.log("unable to get employees");
    });
})
// setup a 'route' to get managers data
app.get("/managers",(req,res)=>{
    dataservice.getManagers()
    .then((data)=>{
        res.status(200).json(data);
    })
    .catch(()=>{
        console.log("unable to get employees");
    });
})
// setup a 'route' to get departments data
app.get("/departments",(req,res)=>{
    dataservice.getDepartments()
    .then((data)=>{
        res.status(200).json({data:data});
    })
    .catch(()=>{
        console.log("unable to get departments");
    });
})

// POST -----------------------------------------
// setup a post 'route' to add employees
app.post("/employees/add", (req, res) => {
    dataservice.addEmployee(req.body) 
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        console.log("unable to add employee");
    });
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