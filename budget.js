const limitInput = document.querySelector('#budgetLimit');
const form = document.querySelector('#expenseForm');
const nameInput = document.querySelector('#expenseName');
const amountInput = document.querySelector('#expenseAmount');
const dateInput = document.querySelector('#expenseDate');
const expenseList = document.querySelector('#expenseList');
const spentTotal = document.querySelector('#spentTotal');
const remainingTotal = document.querySelector('#remainingTotal');
const expenseCount = document.querySelector('#expenseCount');
const emptyExpenses = document.querySelector('#emptyExpenses');
const money = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

let expenses = JSON.parse(localStorage.getItem('lyzel-budget-expenses') || '[]');
limitInput.value = localStorage.getItem('lyzel-budget-limit') || '';
dateInput.value = new Date().toISOString().slice(0, 10);

function renderExpenses() {
    expenseList.replaceChildren();
    const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const limit = Number(limitInput.value) || 0;
    spentTotal.textContent = money.format(spent);
    remainingTotal.textContent = money.format(limit - spent);
    remainingTotal.closest('.summary-stat').classList.toggle('over-budget', spent > limit && limit > 0);
    expenseCount.textContent = `${expenses.length} ${expenses.length === 1 ? 'entry' : 'entries'}`;
    emptyExpenses.hidden = expenses.length > 0;

    [...expenses].sort((a, b) => b.date.localeCompare(a.date)).forEach((expense) => {
        const row = document.createElement('li');
        row.className = 'expense-row';
        const detail = document.createElement('span');
        detail.className = 'expense-detail';
        const title = document.createElement('strong');
        title.textContent = expense.name;
        const date = document.createElement('small');
        date.textContent = new Date(`${expense.date}T00:00:00`).toLocaleDateString();
        detail.append(title, date);
        const amount = document.createElement('span');
        amount.className = 'expense-amount';
        amount.textContent = money.format(expense.amount);
        const remove = document.createElement('button');
        remove.className = 'expense-remove';
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.setAttribute('aria-label', `Remove ${expense.name}`);
        remove.addEventListener('click', () => {
            expenses = expenses.filter((item) => item.id !== expense.id);
            saveExpenses();
        });
        row.append(detail, amount, remove);
        expenseList.append(row);
    });
}

function saveExpenses() {
    localStorage.setItem('lyzel-budget-expenses', JSON.stringify(expenses));
    renderExpenses();
}

limitInput.addEventListener('input', () => {
    localStorage.setItem('lyzel-budget-limit', limitInput.value);
    renderExpenses();
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    expenses.push({ id: crypto.randomUUID(), name: nameInput.value.trim(), amount: Number(amountInput.value), date: dateInput.value });
    saveExpenses();
    form.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);
    nameInput.focus();
});

renderExpenses();
