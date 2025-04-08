const database = require('../database/database');
const jwt = require("jsonwebtoken");

const jwt_key = process.env.JWT_KEY || "expense"; // Use environment variable for JWT key

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwt_key, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Attach the decoded user payload to the request
        next();
    });
};

const addExpense = async (req, res) => {
    const { amount, description, category } = req.body;
    const userId = req.user.userId; // Get the user ID from the decoded JWT

    if (!amount || !description || !category) {
        return res.status(400).json({ message: 'Please provide amount, description, and category.' });
    }

    const query = `INSERT INTO expenses (user_id, amount, description, category, created_at) VALUES (?, ?, ?, ?, NOW())`;

    try {
        const [result] = await database.execute(query, [userId, amount, description, category]);
        console.log('Expense added to database:', result);
        res.status(201).json({ message: 'Expense added successfully', expenseId: result.insertId });
    } catch (error) {
        console.error('Error adding expense to database:', error);
        res.status(500).json({ message: 'Failed to add expense to database.' });
    }
};

const getExpenses = async (req, res) => {
    const userId = req.user.userId; // Get the user ID from the decoded JWT
    const query = `SELECT amount, description, category, created_at FROM expenses WHERE user_id = ? ORDER BY created_at DESC`;

    try {
        const [rows] = await database.execute(query, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching expenses from database:', error);
        res.status(500).json({ message: 'Failed to fetch expenses.' });
    }
};

module.exports = { authenticateToken, addExpense, getExpenses };