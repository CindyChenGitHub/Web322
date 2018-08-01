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
        console.log("f11");
        db.on('error', (err)=>{
            console.log("f12");
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
            console.log("f13");
            //console.log("f13, userSchema: "+JSON.stringify(userSchema));
           User = db.model("Users", userSchema);
           console.log("f14");
           //console.log("f14, users = : " + JSON.stringify(users));
           //console.log("f14, users = " + Users);
           resolve();
        });
    });
};
module.exports.registerUser = function (userData){
    return new Promise(function (resolve, reject) {
        console.log("f3, inside data-service-auth.js->registerUser, userData: "+ userData);
        if( userData.password != userData.password2 ){
            console.log("f4");
            reject ("Passwords do not match");
        }
        else{
            //console.log("f7, users: " + JSON.stringify(Users));
            var newUser = new User(userData);
            //newUser.save();
            console.log("f5, newUser= " + newUser);

            newUser.save()
           // .exec()
            .then(()=>{
                console.log("f51");
                resolve();
            })
            .catch( (err)=>{
               // if (err){
                    if (err.code == 11000){
                        reject("User Name already taken");                 
                    }
                    else{
                        reject("There was an error creating the user: err"+err);
                    } 
               // }
              //  else{ 
               //     console.log("f200");
               //     resolve();
               // }
            }); 
        }
    });
}
module.exports.checkUser = function (userData){
    return new Promise(function (resolve, reject){
        console.log("f21, userData: " + JSON.stringify(userData));
        console.log("f21, User: " + User);
        User.findOne({userName: userData.userName})
        .exec()
        .then((users)=>{
            console.log("f22, users: " + JSON.stringify(users));
            console.log("f22, users: " + users);
            //console.log("f22, users[0]: " + users[0]);
            if (!users){
                console.log("f23");
                reject("Unable to find user: " + userData.userName);
            }
            else if ( users.password != userData.password){
                console.log("f24");
                reject("Incorrect Password for user: " + userData.userName);
            }
            else{
                console.log("f25, users: " + JSON.stringify(users));
                console.log("f25, push: " + JSON.stringify({dateTime: (new Date()).toString(), userAgent: userData.userAgent}));
            //******************************** */
            // ***************THERE IS PROBLEM HERE************
            //******************************* */
                //console.log("f25 user")
               /*  users.update({ userName: users.userName}, 
                    { $push: { loginHistory: {dateTime: (new Date()).toString(), userAgent: userData.userAgent} } },
                    { multi: false }) */
                users.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                console.log("f26, users: " + JSON.stringify(users));
                User.update({ userName: users.userName}, 
                            { $set: { loginHistory: users.loginHistory } },
                            { multi: false })
                .exec()
                .then((users)=>{
                    console.log("f27, users: "+ JSON.stringify(users));
                    resolve(users);
                })
                .catch((err)=>{
                    reject("There was an error verifying the user: " + err);
                })
            }
        })
        .catch((err)=>{
            console.log("f27, err: " + err);
            reject("Unable to find user: " + userData.userName);
        });
    });
}