export default function TransactionSummaryCard({ title, value }) {
  return (
    <div className="col-md-12 col-sm-4 container my-1 border rounded pt-1">
      <p className="text-center font-weight-bold">{title}</p>
      <p className="text-center">{value}</p>
    </div>
  );
}
