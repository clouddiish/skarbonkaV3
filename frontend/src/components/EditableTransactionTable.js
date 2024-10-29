import { useState, useEffect } from "react";
import axios from "axios";
import TransactionAdder from "./TransactionAdder";
import TransactionTable from "./TransactionTable";

export default function EditableTransactionTable() {
  const [transactions, setTransactions] = useState([]);

  // fetch transactions from the API
  const fetchTransactions = () => {
    axios
      .get("http://127.0.0.1:8000/transactions/")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  };

  // call fetchTransactions on page load
  useEffect(() => {
    fetchTransactions();
  }, []);

  // delete a transaction by ID, then refresh the table
  const deleteTransaction = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/transactions/del/${id}/`)
      .then(() => {
        fetchTransactions();
      })
      .catch((error) => {
        console.error("There was a problem deleting the transaction:", error);
      });
  };

  // states to add new transaction
  const [newDate, setNewDate] = useState("");
  const [newValue, setNewValue] = useState(20);
  const [newType, setNewType] = useState("expense");
  const [newCategory, setNewCategory] = useState("");

  // add a new transaction to the transactions array
  const addTransaction = () => {
    let newTransaction = {
      transaction_id:
        transactions.length === 0
          ? 0
          : transactions[transactions.length - 1].transaction_id + 1,
      transaction_date: newDate,
      transaction_value: newValue,
      transaction_type: newType,
      category_id: newCategory,
    };

    setTransactions((prevTransactions) => [
      ...prevTransactions,
      newTransaction,
    ]);
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
