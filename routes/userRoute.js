const express = require("express");
const router = express.Router();

const {addUSer,handleLogin} = require("../controllers/usersCon");


router.post("/adduser",addUSer);
router.post("/login", handleLogin);

module.exports = router;