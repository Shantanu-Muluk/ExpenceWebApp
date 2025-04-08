document.addEventListener('DOMContentLoaded', () => {
    const addExpenseForm = document.getElementById('add-expense-form');
    const expensesListDiv = document.getElementById('expenses-list');

    addExpenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        const expenseData = {
            amount,
            description,
            category,
        };

        const token = localStorage.getItem("authToken")

        try {
            const response = await axios.post('/api/expenses', expenseData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.data;
            if (response.status === 201) {
                console.log('Expense added successfully:', data);
                alert('Expense added!');
                addExpenseForm.reset();
                fetchExpenses(); // Refresh the expense list
            } else {
                console.error('Error adding expense:', data);
                alert(data.message || 'Failed to add expense.');
            }
        } catch (error) {
            console.error('Error sending add expense request:', error);
            alert('An unexpected error occurred.');
        }
    });

    async function fetchExpenses() {

        const token = localStorage.getItem("authToken");

        try {
            const response = await axios.get(`/api/expenses`, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            const data = await response.data;
            if (response.status === 200) {
                console.log('Fetched expenses:', data);
                displayExpenses(data);
            } else {
                console.error('Error fetching expenses:', data);
                expensesListDiv.innerText = data.message || 'Failed to load expenses.';
            }
        } catch (error) {
            console.error('Error sending fetch expenses request:', error);
            expensesListDiv.innerText = 'An unexpected error occurred while loading expenses.';
        }
    }

    function displayExpenses(expenses) {
        expensesListDiv.innerHTML = '';
        if (expenses.length === 0) {
            expensesListDiv.innerText = 'No expenses added yet.';
            return;
        }
        const ul = document.createElement('ul');
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerText = `${expense.amount} - ${expense.description} (${expense.category}) - ${new Date(expense.created_at).toLocaleDateString()}`;
            ul.appendChild(li);
        });
        expensesListDiv.appendChild(ul);
    }

    fetchExpenses();
});