import TransactionTableRow from "./TransactionTableRow";

export default function TransactionTable({
  transactions,
  onDeleteTransaction,
}) {
  let rows = transactions.map((transaction) => {
    return (
      <TransactionTableRow
        key={transaction.id}
        id={transaction.id}
        date={transaction.date}
        value={transaction.value}
        type={transaction.type}
        category={transaction.category}
        onDeleteTransaction={onDeleteTransaction}
      />
    );
  });

  return (
    <table className="table my-3">
      <thead>
        <tr>
          <th>Data</th>
          <th>Wartość</th>
          <th>Typ</th>
          <th>Kategoria</th>
          <th>Usuń</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
