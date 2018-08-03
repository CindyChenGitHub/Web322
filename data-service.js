/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _______Yue Chen_________ Student ID: ___150612166___ Date: ____July 20,2018____
*
*  Online (Heroku) Link: _____   https://yue-chen-web322-assignment.herokuapp.com/   __________
*
********************************************************************************/

const Sequelize = require("sequelize");
var sequelize = new Sequelize ( 'dabtq46lnn68cm', 'wlhvaludlhhecv', '781571', {
    host: 'ec2-23-21-162-90.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: { ssl: true }
});

sequelize
    .authenticate()
    .then(()=> {
        console.log('Connection has been established successfully.');
    })
    .catch(() =>{
        res.status(500).send('Unable to connect to the database:');
    });

const Employees = sequelize.define('Employees', {
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
var Departments = sequelize.define('Departments', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

module.exports.initialize = function (){
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=>{
            resolve("have sync the database");
        })
        .catch(()=>{
            reject("unable to sync the database");
        });
    });
};

module.exports.getAllEmployees = function (){
    return new Promise(function (resolve, reject) {
        Employees.findAll()
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no employee returned");
        });   
    });
};

module.exports.getEmployeesByStatus = function (status){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{status:status}
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no employee returned");
        })
    });
};

module.exports.getEmployeesByDepartment = function (department){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{department:department}
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no employee returned");
        })
    });
};

module.exports.getEmployeesByManager = function (manager){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{employeeManagerNum:manager}
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no employee returned");
        })
    });
};

module.exports.getEmployeeByNum = function (num){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{employeeNum:num}
        })
        .then((data)=>{
            resolve(data[0]);
        })
        .catch(()=>{
            reject("no employee returned");
        })
    });
};

module.exports.addEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const prop in employeeData) {
            if (employeeData[prop] == "") employeeData[prop] = null;
        };
        Employees.create({
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
            resolve(Employees[1]);
        })
        .catch(()=>{
            reject("unable to create employee");
        });   
    });
};

module.exports.updateEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const prop in employeeData) {
            if (employeeData[prop] == "") employeeData[prop] = null;
        };
        Employees.update(
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
            resolve(Employees);
        })
        .catch(()=>{
            reject("unable to update employee");
        });   
    });
};

module.exports.deleteEmployeeByNum = function(num){
    return new Promise(function(resolve,reject){
        Employees.destroy({
            where:{employeeNum:num}
        })
        .then(()=>{
            resolve("destroyed an employee");
        })
        .catch(()=>{
            reject("destroy employee was rejected");
        })
    })
}

module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        Departments.findAll()
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no department returned");
        });   
    });
};

module.exports.getDepartmentById = function (num){
    return new Promise(function (resolve, reject) {
        Departments.findAll({
            where:{departmentId:num}
        })
        .then((data)=>{
            resolve(data[0]);
        })
        .catch(()=>{
            reject("no department returned");
        })
    });
};

module.exports.addDepartment = function(departmentData){
    return new Promise(function (resolve, reject) {
        for (const prop in departmentData) {
            if (departmentData[prop] == "") departmentData[prop] = null;
        };
        Departments.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        })
        .then(()=>{
            console.log("successfully created a new department");
            resolve(Departments[1]);
        })
        .catch(()=>{
            reject("unable to create department");
        });   
    });
};

module.exports.updateDepartment = function(departmentData){
    return new Promise(function (resolve, reject) {
        for (const prop in departmentData) {
            if (departmentData[prop] == "") departmentData[prop] = null;
        };
        Departments.update(
        {
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        },
        {
            where:{departmentId:departmentData.departmentId}
        })
        .then(()=>{
            console.log("successfully update a department");
            resolve(Departments);
        })
        .catch(()=>{
            reject("unable to update department");
        });   
    });
};