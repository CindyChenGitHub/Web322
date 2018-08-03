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
            bcrypt.genSalt(10, function(err, salt) { // Generate a "salt" using 10 rounds
                bcrypt.hash(userData.password, salt, function(err, hash) { // encrypt the password: "myPassword123"
                    // TODO: Store the resulting "hash" value in the DB
                    if (err){
                        reject("There was an error encrypting the password");
                    }
                    else{
                        userData.password = hash;
                        var newUser = new User(userData);
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
            });

        }
    });
}
module.exports.checkUser = function (userData){
    return new Promise(function (resolve, reject){
        console.log("f21, userData: " + JSON.stringify(userData));
        console.log("f21, User: " + User);
        User.find({userName: userData.userName})
        .exec()
        .then((finded_user)=>{
            console.log("f22, funded_user: " + JSON.stringify(finded_user));
            console.log("f22, finded_user: " + finded_user);
            console.log("f22, finded_user: " + finded_user[0]);
            //console.log("f22, users[0]: " + users[0]);
            if (!finded_user){
                console.log("f23");
                reject("Unable to find user: " + userData.userName);
            }
            else{
                bcrypt.compare(userData.password, finded_user[0].password )
                .then((res) => {
                    // res === true if it matches and res === false if it does not match
                    if (res){
                        console.log("f25, user: " + JSON.stringify(finded_user));
                        console.log("f25, push: " + JSON.stringify({dateTime: (new Date()).toString(), userAgent: userData.userAgent}));

                        //console.log("f25 user")
                    /*  users.update({ userName: users.userName}, 
                            { $push: { loginHistory: {dateTime: (new Date()).toString(), userAgent: userData.userAgent} } },
                            { multi: false }) */
                        finded_user[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                        console.log("f26, finded_user: " + JSON.stringify(finded_user[0]));
                    //******************************** */
                    // ***************THERE IS PROBLEM HERE************
                    //******************************* */

                        User.update({ userName: finded_user[0].userName}, 
                                    //{ $set: {password:userData.password}},
                                    { $set: { loginHistory: finded_user[0].loginHistory } },
                                    { multi: false })
                        .exec()
                        .then((users)=>{
                            //console.log("f27, users: "+ JSON.stringify(users));
                            //console.log("f27, users: "+ JSON.stringify(users));
                            console.log("f27, userData: "+ JSON.stringify(userData));
                            console.log("f27, finded_user: "+ JSON.stringify(finded_user[0]));
                            resolve(users);
                        })
                        .catch((err)=>{
                            reject("There was an error verifying the user: " + err);
                        });
                    }
                    else{
                        console.log("f24");
                        reject("Incorrect Password for user: " + userData.userName);
                    }
                 });                
            } 
        })
        .catch((err)=>{
            console.log("f27, err: " + err);
            reject("Unable to find user: " + userData.userName);
       
        });
    });
}