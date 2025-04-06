const database = require("../database/database");

const addUSer = async(req,res)=>{
    const {username,email,password} = req.body;

    const query = `insert into users (Username, Password, Email) values  (?,?,?)`;

    try {
        await database.query(query,[username,email,password]);
        console.log("Data inserted Successfully");
        res.json({message:"Data inserted Successfully", data: req.body})
    } catch (error) {
        console.log("Error while adding the user", error);
        res.status(500).json({ message: "Database insert error", error: err });
    }
}

module.exports = {addUSer}