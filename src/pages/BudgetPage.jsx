import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EXPENSES_KEY = 'lyzel-budget-expenses';
const BUDGET_KEY = 'lyzel-budget-limit';
const DAILY_BUDGET_KEY = 'lyzel-daily-budget-limit';
const SAVINGS_KEY = 'lyzel-savings-total';
const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
const today = new Date();
const currentDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-');
const currentMonth = currentDate.slice(0, 7);

function readExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function BudgetPage() {
  const [expenses, setExpenses] = useState(readExpenses);
  const [limit, setLimit] = useState(() => Number(localStorage.getItem(BUDGET_KEY)) || 0);
  const [budgetInput, setBudgetInput] = useState(() => localStorage.getItem(BUDGET_KEY) || '');
  const [isEditingBudget, setIsEditingBudget] = useState(() => !Number(localStorage.getItem(BUDGET_KEY)));
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [budgetAddition, setBudgetAddition] = useState('');
  const [dailyLimit, setDailyLimit] = useState(() => Number(localStorage.getItem(DAILY_BUDGET_KEY)) || 0);
  const [dailyBudgetInput, setDailyBudgetInput] = useState(() => localStorage.getItem(DAILY_BUDGET_KEY) || '');
  const [isEditingDailyBudget, setIsEditingDailyBudget] = useState(() => !Number(localStorage.getItem(DAILY_BUDGET_KEY)));
  const [savedMoney, setSavedMoney] = useState(() => Number(localStorage.getItem(SAVINGS_KEY)) || 0);
  const [savingsInput, setSavingsInput] = useState('');
  const [isAddingSavings, setIsAddingSavings] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(currentDate);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState('');
  const [showAllExpenses, setShowAllExpenses] = useState(false);

  useEffect(() => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const expensesInScope = useMemo(
    () => expenses.filter((expense) => expense.date?.slice(0, 7) === selectedMonth),
    [expenses, selectedMonth],
  );

  const visibleExpenses = useMemo(
    () => (showAllExpenses ? expenses : expensesInScope)
      .filter((expense) => !selectedDay || expense.date.slice(8, 10) === selectedDay)
      .sort((first, second) => second.date.localeCompare(first.date)),
    [expenses, expensesInScope, selectedDay, showAllExpenses],
  );

  const totalSpent = expensesInScope.reduce((total, expense) => total + Number(expense.amount), 0);
  const spentToday = expenses
    .filter((expense) => expense.date === currentDate)
    .reduce((total, expense) => total + Number(expense.amount), 0);
  const daysInSelectedMonth = new Date(
    Number(selectedMonth.slice(0, 4)),
    Number(selectedMonth.slice(5, 7)),
    0,
  ).getDate();

  function saveBudget() {
    const nextLimit = Number(budgetInput);
    if (nextLimit <= 0) return;
    if (!window.confirm(`Save a monthly budget of ${currency.format(nextLimit)}?`)) return;

    setLimit(nextLimit);
    localStorage.setItem(BUDGET_KEY, String(nextLimit));
    setIsEditingBudget(false);
  }

  function addBudgetAmount(event) {
    event.preventDefault();
    const addition = Number(budgetAddition);
    if (addition <= 0) return;

    const nextLimit = limit + addition;
    setLimit(nextLimit);
    setBudgetInput(String(nextLimit));
    localStorage.setItem(BUDGET_KEY, String(nextLimit));
    setBudgetAddition('');
    setIsAddingBudget(false);
  }

  function saveDailyBudget() {
    const nextLimit = Number(dailyBudgetInput);
    if (nextLimit <= 0) return;

    setDailyLimit(nextLimit);
    localStorage.setItem(DAILY_BUDGET_KEY, String(nextLimit));
    setIsEditingDailyBudget(false);
  }

  function addSavings(event) {
    event.preventDefault();
    const addition = Number(savingsInput);
    if (addition <= 0) return;

    const nextSavedMoney = savedMoney + addition;
    setSavedMoney(nextSavedMoney);
    localStorage.setItem(SAVINGS_KEY, String(nextSavedMoney));
    setSavingsInput('');
    setIsAddingSavings(false);
  }

  function addExpense(event) {
    event.preventDefault();
    const newExpense = {
      id: crypto.randomUUID(),
      name: description.trim(),
      amount: Number(amount),
      date: expenseDate,
    };

    setExpenses((currentExpenses) => [...currentExpenses, newExpense]);
    setSelectedMonth(expenseDate.slice(0, 7));
    setSelectedDay(expenseDate.slice(8, 10));
    setDescription('');
    setAmount('');
  }

  function removeExpense(expenseId) {
    setExpenses((currentExpenses) => currentExpenses.filter(({ id }) => id !== expenseId));
  }

  return (
    <>
      <Header page="budget" />
      <main className="budget-main container">
        <span className="mini-label">A small personal tool</span>
        <h1 className="page-title">Budget tracker</h1>
        <p className="budget-lead">Set a budget for each month and keep a simple list of your spending. Your entries stay saved in this browser.</p>

        <div className="budget-settings-grid">
          <section className="budget-card budget-editor" aria-label="Monthly budget">
            <h2>Monthly budget</h2>
            {isEditingBudget ? (
              <div className="budget-control-row">
                <label className="money-input">
                  <span>₱</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    aria-label="Monthly budget amount"
                    placeholder="Set monthly budget"
                    value={budgetInput}
                    onChange={(event) => setBudgetInput(event.target.value)}
                  />
                </label>
                <div className="budget-edit-actions">
                  <button className="budget-action" type="button" onClick={saveBudget}>Save</button>
                  {limit > 0 && (
                    <button className="budget-cancel" type="button" onClick={() => {
                      setBudgetInput(String(limit));
                      setIsEditingBudget(false);
                    }}>Cancel</button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <strong className="budget-current-amount">{currency.format(limit)}</strong>
                <div className={`budget-quick-actions ${isAddingBudget ? 'budget-quick-actions-end' : ''}`}>
                  {isAddingBudget ? (
                    <button className="budget-cancel" type="button" onClick={() => setIsAddingBudget(false)}>Cancel add</button>
                  ) : (
                    <>
                      <button className="budget-action" type="button" onClick={() => setIsEditingBudget(true)}>Edit</button>
                      <button className="budget-cancel" type="button" onClick={() => setIsAddingBudget(true)}>+ Add</button>
                    </>
                  )}
                </div>
              </>
            )}
            {isAddingBudget && !isEditingBudget && (
              <form className="budget-increase-form" onSubmit={addBudgetAmount}>
                <label className="money-input">
                  <span>₱</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    autoFocus
                    aria-label="Amount to add to the monthly budget"
                    placeholder="Amount"
                    value={budgetAddition}
                    onChange={(event) => setBudgetAddition(event.target.value)}
                  />
                </label>
                <button className="budget-action" type="submit">Add amount</button>
              </form>
            )}
          </section>

          <section className="budget-card budget-editor" aria-label="Daily budget">
            <h2>Daily budget</h2>
            {isEditingDailyBudget ? (
              <div className="budget-control-row">
                <label className="money-input">
                  <span>₱</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    aria-label="Daily budget amount"
                    placeholder="Set daily budget"
                    value={dailyBudgetInput}
                    onChange={(event) => setDailyBudgetInput(event.target.value)}
                  />
                </label>
                <div className="budget-edit-actions">
                  <button className="budget-action" type="button" onClick={saveDailyBudget}>Save</button>
                  {dailyLimit > 0 && (
                    <button className="budget-cancel" type="button" onClick={() => {
                      setDailyBudgetInput(String(dailyLimit));
                      setIsEditingDailyBudget(false);
                    }}>Cancel</button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <strong className="budget-current-amount">{currency.format(dailyLimit)}</strong>
                <div className="budget-quick-actions">
                  <button className="budget-action" type="button" onClick={() => setIsEditingDailyBudget(true)}>Edit</button>
                </div>
              </>
            )}
          </section>

          <section className="budget-card savings-card" aria-label="Savings">
            <h2>Saved money</h2>
            <strong className="budget-current-amount">{currency.format(savedMoney)}</strong>
            {!isAddingSavings ? (
              <div className="budget-quick-actions">
                <button className="budget-action" type="button" onClick={() => setIsAddingSavings(true)}>+ Add savings</button>
              </div>
            ) : (
              <form className="savings-form" onSubmit={addSavings}>
                <label className="money-input">
                  <span>₱</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    autoFocus
                    aria-label="Amount to add to saved money"
                    placeholder="Amount to save"
                    value={savingsInput}
                    onChange={(event) => setSavingsInput(event.target.value)}
                  />
                </label>
                <button className="budget-action" type="submit">Add</button>
                <button className="budget-cancel" type="button" onClick={() => setIsAddingSavings(false)}>Cancel</button>
              </form>
            )}
          </section>
        </div>

        <section className="budget-summary" aria-label="Budget summary">
          <div className="summary-stat"><span>Spent this month</span><strong>{currency.format(totalSpent)}</strong></div>
          <div className={`summary-stat ${limit > 0 && totalSpent > limit ? 'over-budget' : ''}`}>
            <span>Monthly remaining</span><strong>{limit > 0 ? currency.format(limit - totalSpent) : 'Set a budget'}</strong>
          </div>
          <div className="summary-stat"><span>Spent today</span><strong>{currency.format(spentToday)}</strong></div>
          <div className={`summary-stat ${dailyLimit > 0 && spentToday > dailyLimit ? 'over-budget' : ''}`}>
            <span>Daily remaining</span><strong>{dailyLimit > 0 ? currency.format(dailyLimit - spentToday) : 'Set a daily budget'}</strong>
          </div>
        </section>

        <section className="budget-card">
          <h2>Add an expense</h2>
          <form className="expense-form" onSubmit={addExpense}>
            <label>Description
              <input required maxLength="60" placeholder="e.g. Lunch" value={description} onChange={(event) => setDescription(event.target.value)} />
            </label>
            <label>Amount (₱)
              <input required type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </label>
            <label>Date
              <input required type="date" value={expenseDate} onChange={(event) => setExpenseDate(event.target.value)} />
            </label>
            <button className="budget-add" type="submit">Add expense +</button>
          </form>
        </section>

        <section className="budget-card expenses-card">
          <div className="expenses-heading">
            <h2>Expenses</h2>
            <div className="expense-filters">
              <label className="filter-label">Month
                <input className="month-input" type="month" value={selectedMonth} onChange={(event) => {
                  setSelectedMonth(event.target.value);
                  setSelectedDay('');
                }} disabled={showAllExpenses} />
              </label>
              <label className="filter-label">Day
                <select value={selectedDay} onChange={(event) => setSelectedDay(event.target.value)}>
                  <option value="">All days</option>
                  {Array.from({ length: showAllExpenses ? 31 : daysInSelectedMonth }, (_, index) => {
                    const day = String(index + 1).padStart(2, '0');
                    return <option value={day} key={day}>{index + 1}</option>;
                  })}
                </select>
              </label>
              <button
                className="budget-view-toggle"
                type="button"
                onClick={() => {
                  setShowAllExpenses(!showAllExpenses);
                  setSelectedDay('');
                }}
              >
                {showAllExpenses ? 'View selected month' : 'View all expenses'}
              </button>
            </div>
            <span>{visibleExpenses.length} {visibleExpenses.length === 1 ? 'entry' : 'entries'}</span>
          </div>

          <ul className="expense-list">
            {visibleExpenses.map((expense) => (
              <li className="expense-row" key={expense.id}>
                <span className="expense-detail">
                  <strong>{expense.name}</strong>
                  <small>{new Date(`${expense.date}T00:00:00`).toLocaleDateString()}</small>
                </span>
                <span className="expense-amount">{currency.format(Number(expense.amount))}</span>
                <button className="expense-remove" type="button" onClick={() => removeExpense(expense.id)}>Remove</button>
              </li>
            ))}
          </ul>
          {visibleExpenses.length === 0 && (
            <p className="empty-expenses">
              {showAllExpenses
                ? 'No expenses saved yet. Add one above to get started.'
                : `No expenses for ${selectedMonth}. Add one above to get started.`}
            </p>
          )}
        </section>
      </main>
      <Footer note="Saved on this device" />
    </>
  );
}
