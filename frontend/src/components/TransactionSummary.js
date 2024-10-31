import TransactionSummaryCard from "./TransactionSummaryCard";

export default function TransactionSummary({ calculateTransactionsSum }) {
  let income = calculateTransactionsSum("income");
  let spending = calculateTransactionsSum("expense");

  return (
    <div className="row">
      <TransactionSummaryCard title="Income" value={income} />
      <TransactionSummaryCard title="Expenses" value={spending} />
      <TransactionSummaryCard title="Balance" value={income - spending} />
    </div>
  );
}
