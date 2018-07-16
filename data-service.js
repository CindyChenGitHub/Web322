/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _______YC_________ Student ID: ___****___ Date: ____June 15,2018____
*
*  Online (Heroku) Link: _____   https://yue-chen-web322-assignment.herokuapp.com/   __________
*
********************************************************************************/

const Sequelize = require("sequelize");
var sequelize = new Sequelize ( 'dabtq46lnn68cm', 'wlhvaludlhhecv', '781571', {
    host: 'ec2-23-21-162-90.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});
sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

//const fs = require('fs');
/* var Employee = {
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
} */

const Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

module.exports.initialize = function (){
    console.log("in function initialize");
/*     return new Promise(function (resolve, reject){        
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
    }); */
    return new Promise(function (resolve, reject) {
        console.log("into Promise");
        sequelize.sync()
        .then(()=>{
            console.log("into then");
            resolve();
        })
        .catch((err)=>{
            reject("unable to sync the database");
        });
    });
};

module.exports.getAllEmployees = function (){
    console.log("in getAllEmployees function");
/*     return new Promise(function (resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee);
        }
    }) */
    return new Promise(function (resolve, reject) {
        Employee.findAll()
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        });   
    });
};
module.exports.getEmployeesByStatus = function (status){
    console.log("in getEmployeesByStatus function");
/*     return new Promise (function(resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee.filter(function(item, index, array){
                return item.status == status;
            }));
        }
    }); */
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where:{status:status}
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};
module.exports.getEmployeesByDepartment = function (department){
    console.log("in getEmployeesByDepartment function");
/*     return new Promise (function(resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee.filter(function(item, index, array){

                return item.department == department;
            })); 
        }
    }); */
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where:{departments:department}
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};
module.exports.getEmployeesByManager = function (manager){
    console.log("in getEmployeesByManager function");
/*     return new Promise (function(resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        resolve(Employee.filter(function(item, index, array){
            return item.employeeManagerNum == manager;
        }));
    }); */
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where:{employeeManagerNum:manager}
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};
module.exports.getEmployeeByNum = function (num){
    console.log("have inside getEmployeeByNum function, num=" + num);
/*     return new Promise (function(resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee.find(function(item, index, array){
                return item.employeeNum == num;
            }));
        }
    }); */
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where:{employeeNum:num}
        })
        .then((data)=>{
            resolve(data[0]);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};
/* module.exports.getManagers = function(){
    //console.log("have inside getManagers function");
     return new Promise (function (resolve, reject){
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Employee.filter(manager=>manager.isManager));
        }
    }); 
    return new Promise(function (resolve, reject) {
        reject();
});
}; */
module.exports.getDepartments = function(){
    console.log("have inside getDepartments function");
/*     return new Promise (function(resolve, reject){
        if(Department.length == 0){
            reject("no results returned");
        }
        else{
            resolve(Department);
        }
    }); */
    return new Promise(function (resolve, reject) {
        Department.findAll()
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        });   
    });
};
module.exports.addEmployee = function(employeeData){
    console.log(" in addEmployee function");
/*     return new Promise (function(resolve, reject){
        employeeData.isManager = (employeeData.isManager) ? true : false;
        employeeData.employeeNum = Employee.length+1;
        if(Employee.length == 0){
            reject("no results returned");
        }
        else{
            Employee.push(employeeData);
            resolve(Employee);
        }
    }); */
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const prop in employeeData) {
            if (employeeData[prop] == "") employeeData[prop] = null;
        };
        Employee.create({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        })
        .then(()=>{
            console.log("successfully created a new employee");
            resolve();
        })
        .catch(()=>{
            reject("unable to create employee");
        });   
    });
};
module.exports.updateEmployee = function(employeeData){
    console.log("in updateEmployee function");
/*     employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise ((resolve, reject)=>{
        for( let i = 0; i< Employee.length; i++){
            if(Employee[i].employeeNum == employeeData.employeeNum){
                Employee[i] = employeeData;
            }
        }
        resolve();
    }); */
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const prop in employeeData) {
            if (employeeData[prop] == "") employeeData[prop] = null;
        };
        Employee.update(
        {
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        },
        {
            where:{employeeNum:employeeData.employeeNum}
        })
        .then(()=>{
            console.log("successfully update a employee");
            resolve();
        })
        .catch(()=>{
            reject("unable to update employee");
        });   
    });
};