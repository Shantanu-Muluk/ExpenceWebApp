document.addEventListener('DOMContentLoaded', () => {
    const addExpenseSection = document.querySelector('.add-expense-section');
    const showAddExpenseFormBtn = document.getElementById('showAddExpenseFormBtn');
    const expensesListDiv = document.getElementById('expenses-list');

    
    addExpenseSection.style.display = 'none';

    showAddExpenseFormBtn.addEventListener('click', () => {
        addExpenseSection.style.display = 'block';
    });

    document.getElementById('payWithCashfreeBtn').addEventListener('click', function() {
        console.log('Payment button clicked');
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        console.log('Logout button clicked');
        localStorage.removeItem('authToken');
        window.location.href = '/login.html'; 
    });

    fetchExpenses();

    async function fetchExpenses() {
        const token = localStorage.getItem("authToken");
        expensesListDiv.innerHTML = '<p class="no-expenses">Loading expenses...</p>'; 

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
                if (data.length === 0) {
                    expensesListDiv.innerHTML = '<p class="no-expenses">No expenses added yet.</p>';
                }
            } else {
                console.error('Error fetching expenses:', data);
                expensesListDiv.innerHTML = `<p class="no-expenses">${data.message || 'Failed to load expenses.'}</p>`;
            }
        } catch (error) {
            console.error('Error sending fetch expenses request:', error);
            expensesListDiv.innerHTML = '<p class="no-expenses">An unexpected error occurred while loading expenses.</p>';
        }
    }

    function displayExpenses(expenses) {
        expensesListDiv.innerHTML = '';
        if (expenses.length === 0) {
            expensesListDiv.innerHTML = '<p class="no-expenses">No expenses added yet.</p>';
            return;
        }
        const ul = document.createElement('ul');
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="expense-item-details">
                    <p><strong>Description:</strong> ${expense.description}</p>
                    <p><strong>Category:</strong> ${expense.category}</p>
                    <p><strong>Date:</strong> ${new Date(expense.created_at).toLocaleDateString()}</p>
                </div>
                <span class="expense-item-amount">₹${expense.amount}</span>
            `;
            ul.appendChild(li);
        });
        expensesListDiv.appendChild(ul);
    }

    const addExpenseForm = document.getElementById('add-expense-form');
    if (addExpenseForm) {
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

            const token = localStorage.getItem("authToken");

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
                    addExpenseSection.style.display = 'none'; 
                    fetchExpenses(); 
                } else {
                    console.error('Error adding expense:', data);
                    alert(data.message || 'Failed to add expense.');
                }
            } catch (error) {
                console.error('Error sending add expense request:', error);
                alert('An unexpected error occurred.');
            }
        });
    }

    window.buyPremium = async function () {
        const res = await fetch('/premium/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                amount: 99,
                currency: "INR",
                customerEmail: "test@example.com",
                customerName: "Shantanu"
            })
        });
    
        const data = await res.json();
    
        if (data.orderId) {
            window.location.href = `https://sandbox.cashfree.com/pg/app/orders/${data.orderId}`;
        } else {
            alert("Failed to initiate payment.");
        }
    };
    
});