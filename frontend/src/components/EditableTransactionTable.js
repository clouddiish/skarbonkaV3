import { useState, useEffect } from "react";
import axios from "axios";
import TransactionAdder from "./TransactionAdder";
import TransactionTableFilter from "./TransactionTableFilter";
import TransactionTable from "./TransactionTable";
import TransactionSummary from "./TransactionSummary";

export default function EditableTransactionTable() {
  const [transactions, setTransactions] = useState([]);

  // fetch transactions from the API and update transactions
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

  // states to filter transactions table
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");

  // filtered transactions by selected type and category
  let filteredTransactions = transactions;

  if (selectedType === "all" && selectedCategory !== "all") {
    filteredTransactions = transactions.filter((transaction) => {
      return transaction.category_name === selectedCategory;
    });
  } else if (selectedType !== "all" && selectedCategory === "all") {
    filteredTransactions = transactions.filter((transaction) => {
      return transaction.transaction_type === selectedType;
    });
  } else if (selectedType !== "all" && selectedCategory !== "all") {
    filteredTransactions = transactions.filter((transaction) => {
      return (
        transaction.type === selectedType &&
        transaction.category_name === selectedCategory
      );
    });
  }

  // filter transactions by date
  if (selectedStart === "" && selectedEnd !== "") {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      return new Date(transaction.transaction_date) <= new Date(selectedEnd);
    });
  } else if (selectedStart !== "" && selectedEnd === "") {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      return new Date(transaction.transaction_date) >= new Date(selectedStart);
    });
  } else if (selectedStart !== "" && selectedEnd !== "") {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      return (
        new Date(transaction.transaction_date) >= new Date(selectedStart) &&
        new Date(transaction.transaction_date) <= new Date(selectedEnd)
      );
    });
  }

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
  const addTransaction = async () => {
    let newTransaction = {
      transaction_date: newDate,
      transaction_value: parseFloat(newValue), // Ensure this is a float
      transaction_type: newType,
      category_name: newCategory,
    };

    try {
      // Await the post request
      await axios.post(
        "http://127.0.0.1:8000/transactions/add/",
        newTransaction
      );
      // Fetch transactions again after successfully adding
      fetchTransactions();
    } catch (error) {
      console.error(
        "Error adding transaction:",
        error.response?.data?.detail || error.message
      );
    }
  };

  // calculate categories set
  let categories = new Set();
  categories.add("all");

  transactions.forEach((transaction) => {
    categories.add(transaction.category_name);
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

  // calculate the summary values
  const calculateTransactionsSum = (type) => {
    let sum = 0;

    for (let transaction of filteredTransactions) {
      if (transaction.transaction_type === type)
        sum = sum + transaction.transaction_value;
    }
    return sum;
  };

  // render the components
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-2 col-sm-12 order-md-last">
          <h2 className="visually-hidden">summary</h2>
          <TransactionSummary
            calculateTransactionsSum={calculateTransactionsSum}
          />
        </div>
        <div className="col-md-10 col-sm-12 pe-5">
          <h2 className="my-3">add a new transaction</h2>
          <TransactionAdder
            options={options}
            onNewDateChange={setNewDate}
            onNewValueChange={setNewValue}
            onNewTypeChange={setNewType}
            onNewCategoryChange={setNewCategory}
            onAddTransaction={addTransaction}
          />

          <h2 className="my-3">filter transactions</h2>
          <TransactionTableFilter
            options={options}
            onSelectedTypeChange={setSelectedType}
            onSelectedCategoryChange={setSelectedCategory}
            onSelectedStartChange={setSelectedStart}
            onSelectedEndChange={setSelectedEnd}
          />

          <h2 className="visually-hidden  my-3">transactions history</h2>
          <TransactionTable
            className="my-5"
            transactions={filteredTransactions}
            onDeleteTransaction={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}
