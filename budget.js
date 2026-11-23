const limitInput = document.querySelector('#budgetLimit');
const budgetAction = document.querySelector('#budgetAction');
const budgetCancel = document.querySelector('#budgetCancel');
const budgetStatus = document.querySelector('#budgetStatus');
const monthFilter = document.querySelector('#expenseMonth');
const dayFilter = document.querySelector('#expenseDay');
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
const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

function readExpenses() {
    try {
        const stored = JSON.parse(localStorage.getItem('lyzel-budget-expenses') || '[]');
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
}

let expenses = readExpenses();
let monthlyBudget = Number(localStorage.getItem('lyzel-budget-limit')) || 0;
let editingBudget = monthlyBudget <= 0;
limitInput.value = monthlyBudget > 0 ? monthlyBudget : '';
limitInput.disabled = !editingBudget;
monthFilter.value = currentMonth;
dateInput.value = `${currentMonth}-${String(today.getDate()).padStart(2, '0')}`;

function monthExpenses() {
    return expenses.filter((expense) => expense.date?.slice(0, 7) === monthFilter.value);
}

function visibleExpenses() {
    return monthExpenses().filter((expense) => !dayFilter.value || expense.date?.slice(8, 10) === dayFilter.value);
}

function formatMonth(month) {
    if (!month) return 'the selected month';
    return new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function updateDays() {
    const selectedDay = dayFilter.value;
    const [year, month] = (monthFilter.value || currentMonth).split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    dayFilter.replaceChildren(new Option('All days', ''));
    for (let day = 1; day <= daysInMonth; day += 1) {
        dayFilter.add(new Option(String(day), String(day).padStart(2, '0')));
    }
    if ([...dayFilter.options].some((option) => option.value === selectedDay)) dayFilter.value = selectedDay;
}

function updateBudgetControls() {
    limitInput.disabled = !editingBudget;
    budgetCancel.hidden = !editingBudget || monthlyBudget <= 0;
    budgetAction.textContent = editingBudget
        ? (monthlyBudget > 0 ? 'Confirm & save' : 'Save budget')
        : 'Edit budget';
    budgetStatus.textContent = !editingBudget && monthlyBudget > 0
        ? 'Budget saved. Choose Edit budget to change it.'
        : '';
}

function renderExpenses() {
    expenseList.replaceChildren();
    const allMonthExpenses = monthExpenses();
    const shownExpenses = visibleExpenses();
    const spent = allMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    spentTotal.textContent = money.format(spent);
    remainingTotal.textContent = monthlyBudget > 0 ? money.format(monthlyBudget - spent) : 'Set a budget';
    remainingTotal.closest('.summary-stat').classList.toggle('over-budget', monthlyBudget > 0 && spent > monthlyBudget);
    expenseCount.textContent = `${shownExpenses.length} ${shownExpenses.length === 1 ? 'entry' : 'entries'}`;
    emptyExpenses.hidden = shownExpenses.length > 0;
    const dayText = dayFilter.value ? ` on day ${Number(dayFilter.value)}` : '';
    emptyExpenses.textContent = `No expenses for ${formatMonth(monthFilter.value)}${dayText}. Add one above to get started.`;

    [...shownExpenses].sort((a, b) => b.date.localeCompare(a.date)).forEach((expense) => {
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

budgetAction.addEventListener('click', () => {
    if (!editingBudget) {
        editingBudget = true;
        limitInput.value = monthlyBudget;
        updateBudgetControls();
        limitInput.focus();
        return;
    }

    if (!limitInput.reportValidity()) return;
    limitInput.setCustomValidity('');
    const nextBudget = Number(limitInput.value);
    if (nextBudget <= 0) {
        limitInput.setCustomValidity('Enter a monthly budget greater than zero.');
        limitInput.reportValidity();
        return;
    }
    if (!window.confirm(`Save a monthly budget of ${money.format(nextBudget)}?`)) return;

    monthlyBudget = nextBudget;
    localStorage.setItem('lyzel-budget-limit', String(monthlyBudget));
    editingBudget = false;
    updateBudgetControls();
    budgetStatus.textContent = 'Budget confirmed and saved.';
    renderExpenses();
});

budgetCancel.addEventListener('click', () => {
    editingBudget = false;
    limitInput.setCustomValidity('');
    limitInput.value = monthlyBudget;
    updateBudgetControls();
});

monthFilter.addEventListener('change', () => {
    updateDays();
    renderExpenses();
});
dayFilter.addEventListener('change', renderExpenses);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    expenses.push({
        id: crypto.randomUUID(),
        name: nameInput.value.trim(),
        amount: Number(amountInput.value),
        date: dateInput.value
    });
    localStorage.setItem('lyzel-budget-expenses', JSON.stringify(expenses));
    monthFilter.value = dateInput.value.slice(0, 7);
    updateDays();
    dayFilter.value = dateInput.value.slice(8, 10);
    renderExpenses();
    form.reset();
    dateInput.value = `${currentMonth}-${String(today.getDate()).padStart(2, '0')}`;
    nameInput.focus();
});

updateDays();
updateBudgetControls();
renderExpenses();
