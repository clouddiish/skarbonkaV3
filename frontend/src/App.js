import axios from "axios";
import React, { useEffect, useState } from "react";

function TransactionsList() {
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

  return (
    <div>
      <h2>Transactions List</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.transaction_id}>
            {transaction.transaction_date} - ${transaction.transaction_value} -{" "}
            {transaction.transaction_type}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionsList;
