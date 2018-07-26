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
const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
var userSchema = new Schema({
    "userName":{
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory":[{
        "dateTime": Date,
        "userAgent": String
    }]
});
let User; // to be defined on new connection (see initialize)
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://cindy:781571cy@ds255451.mlab.com:55451/web322_a6");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};
module.exports.registerUser = function (userData){
    return new Promise(function (resolve, reject) {
        if( userData.password != userData.password2 ){
            reject ("Passwords do not match");
        }
        else{
            let newUser = new User(userData);
            newUser.save((err)=>{
                if (err){
                    if (err.code == 11000){
                        reject("User Name already taken");                 
                    }
                    else{
                        reject("There was an error creating the user: err"+err);
                    }                   
                }
                else{
                    resolve();
                }
            });
        }
    });
}
module.exports.checkUser = function (userData){
    return new Promise(function (resolve, feject){
        User.find({user: userData.userName})
        .exec()
        .then((users)=>{
            if (!users){
                reject("Unable to find user: " + userData.userName);
            }
            else if ( users[0].password != userData.password){
                reject("Incorrect Password for user: " + userData.userName);
            }
            else{
                users[0].push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                User.update({ userName: users[0].userName}, 
                            { $set: { loginHistory: users[0].loginHistory } },
                            { multi: false })
                .exec()
                .then(()=>{
                    resolve(users[0]);
                })
                .catch((err)=>{
                    reject("There was an error verifying the user: " + err);
                })
            }
        })
        .catch(()=>{
            reject("Unable to find user: " + userdata.userName);
        });
    });
}