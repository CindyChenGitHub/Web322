/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _______YC_________ Student ID: ___****___ Date: ____June 15,2018____
*
*  Online (Heroku) Link: _____https://yue-chen-web322-assignment.herokuapp.com/__________
*
********************************************************************************/
const fs = require('fs');
var Employee = {
    employeeNum: [],
    firstName: [],
    lastName: [],
    email: [],
    SSN: [],
    addressStreet: [],
    addressCity: [],
    addressState: [],
    addressPostal: [],
    maritalStatus: [],
    isManager: [],
    employeeManagerNum: [],
    status: [],
    department: [],
    hireDate: []
}
var Department = {
    departmentId: [],
    departmentName: []
}
module.exports.initialize = function (){
    return new Promise(function (resolve, reject){        
        fs.readFile( './data/employees.json' ,(err,data)=>{
            if (err){
                reject("unable to read file");
            }else{
                Employee = JSON.parse(data);
                fs.readFile( './data/departments.json',(err,data)=>{   
                    if (err){
                        reject("unable to read file");
                    }else{
                        Department = JSON.parse(data);
                        resolve(Department);
                    }
                });
            }
        });
    });
}

module.exports.getAllEmployees = function (){
    return new Promise(function (resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee);
        }
    })
}
module.exports.getEmployeesByStatus = function (status){
    return new Promise (function(resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee.filter(function(item, index, array){
                return item.status = status;
            }));
        }
    });
}
module.exports.getEmployeesByDepartment = function (department){
    return new Promise (function(resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee.filter(function(item, index, array){

                return item.department = department;
            })); 
        }
    });
}
module.exports.getEmployeesByManager = function (manager){
    return new Promise (function(resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        resolve(Employee.filter(function(item, index, array){
            return item.employeeManagerNum = manager;
        }));
    });
}
module.exports.getEmployeeByNum = function (num){
    console.log("have inside getEmployeeByNum function, num=" + num);
    return new Promise (function(resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee.find(function(item, index, array){
                return item.employeeNum == num;
            }));
        }
    });
}
module.exports.getManagers = function(){
    console.log("have inside getManagers function");
    return new Promise (function (resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee.filter(manager=>manager.isManager));
        }
    });
}
module.exports.getDepartments = function(){
    console.log("have inside getDepartments function");
    return new Promise (function(resolve, reject){
        if(Department.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Department);
        }
    });
}
module.exports.addEmployee = function(employeeData){
    return new Promise (function(resolve, reject){
        employeeData.isManager = (employeeData.isManager) ? true : false;
        employeeData.employeeNum = Employee.length+1;
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            Employee.push(employeeData);
            resolve(Employee);
        }
    });
}