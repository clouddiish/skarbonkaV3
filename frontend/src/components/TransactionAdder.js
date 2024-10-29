export default function TransactionAdder({
  options,
  onNewDateChange,
  onNewValueChange,
  onNewTypeChange,
  onNewCategoryChange,
  onAddTransaction,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-3 col-sm-12">
          <label htmlFor="data" className="my-2">
            Date:
          </label>
          <input
            type="date"
            id="data"
            className="form-control"
            onChange={(e) => onNewDateChange(e.target.value)}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <label htmlFor="value" className="my-2">
            Value:
          </label>
          <input
            type="number"
            id="value"
            step="0.01"
            placeholder={20}
            className="form-control"
            onChange={(e) => onNewValueChange(Number(e.target.value))}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <label htmlFor="type" className="my-2">
            Type:
          </label>
          <select
            id="type"
            className="form-select"
            onChange={(e) => onNewTypeChange(e.target.value)}
          >
            <option value="expense">expense</option>
            <option value="income">income</option>
          </select>
        </div>
        <div className="col-md-3 col-sm-12">
          <label htmlFor="category" className="my-2">
            Category:
          </label>
          <input
            list="categoryList"
            className="form-control"
            onChange={(e) => onNewCategoryChange(e.target.value)}
          />
          <datalist id="categoryList">{options}</datalist>
        </div>
      </div>
      <div className="row justify-content-end">
        <div className="col-md-2 col-sm-12 mt-3">
          <button type="submit" className="container btn btn-light">
            Add
          </button>
        </div>
      </div>
    </form>
  );
}
