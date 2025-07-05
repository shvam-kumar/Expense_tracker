import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie } from "recharts";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import 'react-toastify/dist/ReactToastify.css';

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
  };

  const addTransaction = () => {
    if (!description || !amount) return;

    setTransactions([
      ...transactions,
      { id: Date.now(), description, amount: parseFloat(amount) }
    ]);

    toast.success("Transaction Added!");
    setDescription("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.error("Transaction Deleted!");
  };

  const balance = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredTransactions = transactions.filter(t => {
    if (filter === "income") return t.amount > 0;
    if (filter === "expense") return t.amount < 0;
    return true;
  });

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <ToastContainer />
      <div className="header">
        <h1>Expense Tracker</h1>
        <button className="toggle-btn" onClick={toggleDarkMode}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="input-section">
        <input
          className="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input"
          placeholder="Amount (use negative)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={addTransaction}>Add</button>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("income")}>Income</button>
        <button onClick={() => setFilter("expense")}>Expenses</button>
      </div>

      <h2 className="balance">Balance: ₹{balance.toFixed(2)}</h2>

      <div className="transactions-list">
        <AnimatePresence>
          {filteredTransactions.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={`transaction-card ${t.amount > 0 ? 'income' : 'expense'}`}
            >
              <div className="transaction-details">
                <span className="description">{t.description.toUpperCase()}</span>
                <span className="amount">{t.amount > 0 ? '+' : ''}₹{t.amount.toFixed(2)}</span>
              </div>
              <button className="delete-btn" onClick={() => deleteTransaction(t.id)}>🗑️</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {transactions.length > 0 && (
        <>
          <h2>Summary Charts</h2>
          <div className="chart-wrapper">
            <div className="chart-container">
              <h3>Bar Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredTransactions}>
                  <XAxis dataKey="description" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Pie Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredTransactions}
                    dataKey="amount"
                    nameKey="description"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
