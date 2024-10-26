import { useState } from "react";
import TransactionAdder from "./TransactionAdder";
import TransactionTable from "./TransactionTable";

export default function EditableTransactionTable() {
  const [transactions, setTransactions] = useState([
    {
      id: 0,
      date: "2024-04-16",
      value: 20,
      type: "Wydatek",
      category: "Jedzenie",
    },
    {
      id: 1,
      date: "2024-04-15",
      value: 30,
      type: "Wydatek",
      category: "Jedzenie",
    },
    {
      id: 2,
      date: "2024-04-16",
      value: 200,
      type: "Wydatek",
      category: "Lekarz",
    },
    {
      id: 3,
      date: "2024-04-16",
      value: 2500,
      type: "Przychód",
      category: "Pensja",
    },
    {
      id: 4,
      date: "2024-04-16",
      value: 1000,
      type: "Przychód",
      category: "Babcia",
    },
    {
      id: 5,
      date: "2024-04-17",
      value: 50,
      type: "Wydatek",
      category: "Transport",
    },
    {
      id: 6,
      date: "2024-04-17",
      value: 150,
      type: "Wydatek",
      category: "Jedzenie",
    },
    {
      id: 7,
      date: "2024-04-18",
      value: 300,
      type: "Wydatek",
      category: "Lekarz",
    },
    {
      id: 8,
      date: "2024-04-18",
      value: 500,
      type: "Wydatek",
      category: "Rachunki",
    },
    {
      id: 9,
      date: "2024-04-19",
      value: 80,
      type: "Wydatek",
      category: "Jedzenie",
    },
    {
      id: 10,
      date: "2024-04-19",
      value: 70,
      type: "Wydatek",
      category: "Ubrania",
    },
    {
      id: 11,
      date: "2024-04-20",
      value: 2500,
      type: "Wydatek",
      category: "Rachunki",
    },
    {
      id: 12,
      date: "2024-04-20",
      value: 100,
      type: "Wydatek",
      category: "Transport",
    },
    {
      id: 13,
      date: "2024-04-21",
      value: 1500,
      type: "Przychód",
      category: "Pensja",
    },
    {
      id: 14,
      date: "2024-04-21",
      value: 200,
      type: "Wydatek",
      category: "Ubrania",
    },
    {
      id: 15,
      date: "2024-04-16",
      value: 100,
      type: "Wydatek",
      category: "Babcia",
    },
  ]);

  // states to add new transaction
  const [newDate, setNewDate] = useState("");
  const [newValue, setNewValue] = useState(20);
  const [newType, setNewType] = useState("Wydatek");
  const [newCategory, setNewCategory] = useState("");

  // add a new transaction to the transactions array
  const addTransaction = () => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      {
        id:
          prevTransactions.length === 0
            ? 0
            : prevTransactions[prevTransactions.length - 1].id + 1,
        date: newDate,
        value: newValue,
        type: newType,
        category: newCategory,
      },
    ]);
  };

  // delete the transaction with a given id from the transactions array
  const deleteTransaction = (id) => {
    let newTransactions = transactions.filter((transaction) => {
      return transaction.id !== id;
    });
    setTransactions(newTransactions);
  };

  // calculate categories set
  let categories = new Set();
  categories.add("Wszystko");

  transactions.forEach((transaction) => {
    categories.add(transaction.category);
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
          <h2 className="my-3">Dodaj nową transakcję</h2>
          <TransactionAdder
            options={options}
            onNewDateChange={setNewDate}
            onNewValueChange={setNewValue}
            onNewTypeChange={setNewType}
            onNewCategoryChange={setNewCategory}
            onAddTransaction={addTransaction}
          />

          <h2 className="visually-hidden">Tabela transakcji</h2>
          <TransactionTable
            transactions={transactions}
            onDeleteTransaction={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}
