const express = require("express");
const router = express.Router();

const { addUSer, handleLogin } = require("../controllers/usersCon");
const expenseController = require('../controllers/expenseCon');

const { authenticateToken } = require("../controllers/expenseCon");
const { createCashfreeOrderForPremium, handleCashfreeWebhook } = require('../controllers/premiumCon');

router.post("/adduser", addUSer);
router.post("/login", handleLogin);

router.post('/api/expenses', authenticateToken, expenseController.addExpense);
router.get('/api/expenses', authenticateToken, expenseController.getExpenses);

router.post('/premium/create-order', authenticateToken, createCashfreeOrderForPremium); // ✅ fixed here
router.post('/premium/cashfree-webhook', handleCashfreeWebhook);

module.exports = router;
