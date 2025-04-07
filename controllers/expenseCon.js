const database = require('../database/database'); // Adjust path as needed

const addExpense = async (req, res) => {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) {
        return res.status(400).json({ message: 'Please provide amount, description, and category.' });
    }

    const query = `INSERT INTO expenses (amount, description, category, created_at) VALUES (?, ?, ?, NOW())`;

    try {
        const [result] = await database.execute(query, [amount, description, category]);
        console.log('Expense added to database:', result);
        res.status(201).json({ message: 'Expense added successfully', expenseId: result.insertId });
    } catch (error) {
        console.error('Error adding expense to database:', error);
        res.status(500).json({ message: 'Failed to add expense to database.' });
    }
};

const getExpenses = async (req, res) => {
    // If you remove userId, you'll need another way to identify whose expenses to fetch.
    // For now, this will fetch ALL expenses. This is generally NOT what you want in a real application.
    const query = `SELECT amount, description, category, created_at FROM expenses ORDER BY created_at DESC`;

    try {
        const [rows] = await database.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching expenses from database:', error);
        res.status(500).json({ message: 'Failed to fetch expenses.' });
    }
};

module.exports = { addExpense, getExpenses };