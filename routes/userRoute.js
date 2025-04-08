// routes/userRoute.js
const express = require("express");
const router = express.Router();

const { addUSer, handleLogin } = require("../controllers/usersCon");
const expenseController = require('../controllers/expenseCon');

const {authenticateToken} = require("../controllers/expenseCon")


router.post("/adduser", addUSer);
router.post("/login", handleLogin);

router.post('/api/expenses', authenticateToken, expenseController.addExpense);
router.get('/api/expenses', authenticateToken , expenseController.getExpenses);

module.exports = router;