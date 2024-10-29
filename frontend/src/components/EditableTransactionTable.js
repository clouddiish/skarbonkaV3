import axios from "axios";
import React, { useEffect, useState } from "react";
import TransactionAdder from "./TransactionAdder";
import TransactionTable from "./TransactionTable";

export default function EditableTransactionTable() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/transactions/")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("There was a problem with the axios request:", error);
      });
  }, []);

  // states to add new transaction
  const [newDate, setNewDate] = useState("");
  const [newValue, setNewValue] = useState(20);
  const [newType, setNewType] = useState("expense");
  const [newCategory, setNewCategory] = useState("");

  // add a new transaction to the transactions array
  const addTransaction = () => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      {
        transaction_id:
          prevTransactions.length === 0
            ? 0
            : prevTransactions[prevTransactions.length - 1].id + 1,
        transaction_date: newDate,
        transaction_value: newValue,
        transaction_type: newType,
        category_id: newCategory,
      },
    ]);
  };

  // delete the transaction with a given id from the transactions array
  const deleteTransaction = (id) => {
    let newTransactions = transactions.filter((transaction) => {
      return transaction.transaction_id !== id;
    });
    setTransactions(newTransactions);
  };

  // calculate categories set
  let categories = new Set();

  transactions.forEach((transaction) => {
    categories.add(transaction.category_id);
  });

  // create JSX options to insert from the categories set
  let options = [];

  categories.forEach((category) => {
    options.push(
      <option key={category} value={category}>
        {category}
      </option>
    );
  });

  // render the components
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2 className="my-3">Add a new transaction</h2>
          <TransactionAdder
            options={options}
            onNewDateChange={setNewDate}
            onNewValueChange={setNewValue}
            onNewTypeChange={setNewType}
            onNewCategoryChange={setNewCategory}
            onAddTransaction={addTransaction}
          />

          <h2 className="my-3">Transactions history</h2>
          <TransactionTable
            transactions={transactions}
            onDeleteTransaction={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}
