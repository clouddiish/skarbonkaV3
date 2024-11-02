import TransactionSummaryCard from "./TransactionSummaryCard";
import "./TransactionSummary.css";

export default function TransactionSummary({ calculateTransactionsSum }) {
  let income = calculateTransactionsSum("income");
  let spending = calculateTransactionsSum("expense");

  return (
    <div className="row summary-card">
      <TransactionSummaryCard title="income" value={income} />
      <TransactionSummaryCard title="expenses" value={spending} />
      <TransactionSummaryCard title="balance" value={income - spending} />
    </div>
  );
}
