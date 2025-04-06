const express = require("express");
const router = express.Router();

const {addUSer} = require("../controllers/usersCon");


router.post("/adduser",addUSer);

module.exports = router;