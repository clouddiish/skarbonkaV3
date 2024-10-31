export default function TransactionTableFilter({
  options,
  onSelectedTypeChange,
  onSelectedCategoryChange,
  onSelectedStartChange,
  onSelectedEndChange,
}) {
  return (
    <form>
      <div className="row">
        <div className="col-md-3 col-sm-12">
          <label htmlFor="start-date" className="my-2">
            start date:
          </label>
          <input
            type="date"
            id="start-date"
            className="form-control"
            onChange={(e) => onSelectedStartChange(e.target.value)}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <label htmlFor="end-date" className="my-2">
            end date:
          </label>
          <input
            type="date"
            id="end-date"
            className="form-control"
            onChange={(e) => onSelectedEndChange(e.target.value)}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <label htmlFor="ftyp" className="my-2">
            type:
          </label>
          <select
            id="ftyp"
            className="form-select"
            onChange={(e) => onSelectedTypeChange(e.target.value)}
          >
            <option value="all">all</option>
            <option value="expense">expense</option>
            <option value="income">income</option>
          </select>
        </div>
        <div className="col-md-3 col-sm-12">
          <label htmlFor="fkategorie" className="my-2">
            category:
          </label>
          <select
            id="fkategorie"
            className="form-select"
            onChange={(e) => onSelectedCategoryChange(e.target.value)}
          >
            {options}
          </select>
        </div>
      </div>
    </form>
  );
}
