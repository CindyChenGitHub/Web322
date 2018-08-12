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
const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const bcrypt = require('bcryptjs');
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
let User;
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://cindy:781571cy@ds255451.mlab.com:55451/web322_a6");
        db.on('error', (err)=>{
            reject(err);
        });
        db.once('open', ()=>{
           User = db.model("Users", userSchema);
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
            var newUser = new User(userData);
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(userData.password, salt, function(err, hash) {
                    if (err){
                        reject("There was an error encrypting the password");
                    }
                    else{
                        newUser.password = hash;
                        newUser.save()
                        .then(()=>{
                            resolve();
                        })
                        .catch( (err)=>{
                            if (err.code == 11000){
                                reject("User Name already taken");                 
                            }
                            else{
                                reject("There was an error creating the user: err"+err);
                            }
                        }); 
                    }
                });
            });

        }
    });
}
module.exports.checkUser = function (userData){
    return new Promise(function (resolve, reject){
        User.find({userName: userData.userName})
        .exec()
        .then((finded_user)=>{
            bcrypt.compare(userData.password, finded_user[0].password )
            .then((res) => {
                finded_user[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                User.update({ userName: finded_user[0].userName},
                            { $set: { loginHistory: finded_user[0].loginHistory } },
                            { multi: false })
                .exec()
                .then( ()=>{
                    resolve(finded_user[0]);
                })
                .catch((err)=>{
                    reject("There was an error verifying the user: " + err);
                });
            })
            .catch((err)=>{
                reject("Incorrect Password for user: " + userData.userName);
            })  
        })
        .catch((err)=>{
            reject("Unable to find user: " + userData.userName);
        });
    });
}