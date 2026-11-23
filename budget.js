const limitInput = document.querySelector('#budgetLimit');
const budgetMonthInput = document.querySelector('#budgetMonth');
const budgetAction = document.querySelector('#budgetAction');
const budgetCancel = document.querySelector('#budgetCancel');
const budgetStatus = document.querySelector('#budgetStatus');
const filterMonthInput = document.querySelector('#expenseMonth');
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
const monthNow = new Date();
const currentMonth = `${monthNow.getFullYear()}-${String(monthNow.getMonth() + 1).padStart(2, '0')}`;
const budgetStorageKey = 'lyzel-budget-monthly-budgets';

function readStoredJson(key, fallback) {
    try {
        const stored = JSON.parse(localStorage.getItem(key));
        return stored ?? fallback;
    } catch {
        return fallback;
    }
}

let expenses = readStoredJson('lyzel-budget-expenses', []);
let budgets = readStoredJson(budgetStorageKey, null);
if (!budgets || typeof budgets !== 'object' || Array.isArray(budgets)) {
    const oldLimit = Number(localStorage.getItem('lyzel-budget-limit'));
    budgets = oldLimit > 0 ? { [currentMonth]: oldLimit } : {};
    localStorage.setItem(budgetStorageKey, JSON.stringify(budgets));
}
let editingBudget = false;

budgetMonthInput.value = currentMonth;
filterMonthInput.value = currentMonth;
dateInput.value = `${currentMonth}-${String(monthNow.getDate()).padStart(2, '0')}`;

function selectedMonth() {
    return budgetMonthInput.value || currentMonth;
}

function selectedMonthExpenses() {
    const month = selectedMonth();
    return expenses.filter((expense) => expense.date?.slice(0, 7) === month);
}

function updateBudgetControl() {
    const hasBudget = Number(budgets[selectedMonth()]) > 0;
    if (!editingBudget) limitInput.value = hasBudget ? budgets[selectedMonth()] : '';
    limitInput.disabled = !editingBudget;
    budgetCancel.hidden = !editingBudget;
    budgetAction.textContent = editingBudget
        ? (hasBudget ? 'Confirm & save' : 'Save budget')
        : (hasBudget ? 'Edit budget' : 'Add budget');
    budgetStatus.textContent = hasBudget && !editingBudget
        ? `Budget saved for ${formatMonth(selectedMonth())}. Click Edit budget to change it.`
        : '';
}

function formatMonth(month) {
    if (!month) return '';
    return new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function renderExpenses() {
    expenseList.replaceChildren();
    const visibleExpenses = selectedMonthExpenses();
    const spent = visibleExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const limit = Number(budgets[selectedMonth()]) || 0;

    spentTotal.textContent = money.format(spent);
    remainingTotal.textContent = limit > 0 ? money.format(limit - spent) : 'Set a budget';
    remainingTotal.closest('.summary-stat').classList.toggle('over-budget', limit > 0 && spent > limit);
    expenseCount.textContent = `${visibleExpenses.length} ${visibleExpenses.length === 1 ? 'entry' : 'entries'}`;
    emptyExpenses.hidden = visibleExpenses.length > 0;
    emptyExpenses.textContent = `No expenses for ${formatMonth(selectedMonth())}. Add one above to get started.`;

    [...visibleExpenses].sort((a, b) => b.date.localeCompare(a.date)).forEach((expense) => {
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
        amount.textContent = money.format(Number(expense.amount));
        const remove = document.createElement('button');
        remove.className = 'expense-remove';
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.setAttribute('aria-label', `Remove ${expense.name}`);
        remove.addEventListener('click', () => {
            expenses = expenses.filter((item) => item.id !== expense.id);
            localStorage.setItem('lyzel-budget-expenses', JSON.stringify(expenses));
            renderExpenses();
        });
        row.append(detail, amount, remove);
        expenseList.append(row);
    });
}

function render() {
    updateBudgetControl();
    renderExpenses();
}

budgetAction.addEventListener('click', () => {
    if (!editingBudget) {
        editingBudget = true;
        budgetStatus.textContent = '';
        updateBudgetControl();
        limitInput.focus();
        return;
    }

    if (!limitInput.reportValidity() || Number(limitInput.value) <= 0) {
        limitInput.setCustomValidity(Number(limitInput.value) > 0 ? '' : 'Enter a budget greater than zero.');
        limitInput.reportValidity();
        return;
    }

    limitInput.setCustomValidity('');
    const amount = Number(limitInput.value);
    const month = selectedMonth();
    if (!window.confirm(`Save a monthly budget of ${money.format(amount)} for ${formatMonth(month)}?`)) return;

    budgets[month] = amount;
    localStorage.setItem(budgetStorageKey, JSON.stringify(budgets));
    localStorage.setItem('lyzel-budget-limit', String(amount));
    editingBudget = false;
    render();
    budgetStatus.textContent = `Budget confirmed and saved for ${formatMonth(month)}.`;
});

budgetCancel.addEventListener('click', () => {
    editingBudget = false;
    limitInput.setCustomValidity('');
    render();
});

function changeSelectedMonth(month) {
    if (!month) return;
    editingBudget = false;
    budgetMonthInput.value = month;
    filterMonthInput.value = month;
    render();
}

budgetMonthInput.addEventListener('change', () => changeSelectedMonth(budgetMonthInput.value));
filterMonthInput.addEventListener('change', () => changeSelectedMonth(filterMonthInput.value));

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const expenseMonth = dateInput.value.slice(0, 7);
    expenses.push({
        id: crypto.randomUUID(),
        name: nameInput.value.trim(),
        amount: Number(amountInput.value),
        date: dateInput.value
    });
    localStorage.setItem('lyzel-budget-expenses', JSON.stringify(expenses));
    changeSelectedMonth(expenseMonth);
    form.reset();
    dateInput.value = `${currentMonth}-${String(monthNow.getDate()).padStart(2, '0')}`;
    nameInput.focus();
});

render();
