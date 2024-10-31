import TransactionSummaryCard from "./TransactionSummaryCard";

export default function TransactionSummary({ calculateTransactionsSum }) {
  let income = calculateTransactionsSum("income");
  let spending = calculateTransactionsSum("expense");

  return (
    <div className="row">
      <TransactionSummaryCard title="income" value={income} />
      <TransactionSummaryCard title="expenses" value={spending} />
      <TransactionSummaryCard title="balance" value={income - spending} />
    </div>
  );
}
