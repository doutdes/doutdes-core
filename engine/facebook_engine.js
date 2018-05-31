'use strict';

let manager = require ('../api_handler/facebook_manager');

class Facebook_Engine{
    static fbsearch() {
        return new Promise((resolve, reject)=> {
            resolve(manager.Facebook_Manager.fbsearch());
            reject(err =>{
                console.log("Promise rejected by Facebook Engine");
                console.log(err);
            });
        });
    };

    static fbpageInfo(){
        return new Promise((resolve, reject)=> {
            resolve(manager.Facebook_Manager.fbpageInfo());
            reject(err =>{
                console.log("Promise rejected by Facebook Engine");
                console.log(err);
            });
        });
    };

}

module.exports.Facebook_Engine = Facebook_Engine;