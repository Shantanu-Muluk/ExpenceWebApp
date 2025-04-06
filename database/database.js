const mysql = require("mysql2");

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"sonu@9878",
    database:"expence"
})

pool.getConnection((err,connection)=>{
    if(err){
        console.log("Error while creating the databse connection",err)
    }

    console.log("Connection created");
    connection.release();
})

module.exports = pool.promise();