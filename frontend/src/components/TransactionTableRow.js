export default function TransactionTableRow({
  id,
  date,
  value,
  type,
  category,
  onDeleteTransaction,
}) {
  return (
    <tr>
      <td>{date}</td>
      <td>{value}</td>
      <td>{type}</td>
      <td>{category}</td>
      <td>
        <button
          onClick={() => onDeleteTransaction(id)}
          type="button"
          className="btn btn-light"
        >
          Usuń
        </button>
      </td>
    </tr>
  );
}
