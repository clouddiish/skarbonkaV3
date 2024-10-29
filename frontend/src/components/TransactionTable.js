import TransactionTableRow from "./TransactionTableRow";

export default function TransactionTable({
  transactions,
  onDeleteTransaction,
}) {
  let rows = transactions.map((transaction) => {
    return (
      <TransactionTableRow
        key={transaction.transaction_id}
        id={transaction.transaction_id}
        date={transaction.transaction_date}
        value={transaction.transaction_value}
        type={transaction.transaction_type}
        category={transaction.category_id}
        onDeleteTransaction={onDeleteTransaction}
      />
    );
  });

  return (
    <table className="table my-3">
      <thead>
        <tr>
          <th>Date</th>
          <th>Value</th>
          <th>Type</th>
          <th>Category</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
