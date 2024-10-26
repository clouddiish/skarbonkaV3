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
            Data:
          </label>
          <input
            type="date"
            id="data"
            className="form-control"
            onChange={(e) => onNewDateChange(e.target.value)}
          />
        </div>
        <div className="col-md-3 col-sm-12">
          <label htmlFor="wartosc" className="my-2">
            Wartość:
          </label>
          <input
            type="number"
            id="wartosc"
            step="0.01"
            placeholder={20}
            className="form-control"
            onChange={(e) => onNewValueChange(Number(e.target.value))}
          />
          <p id="wartoscKom" className="komunikat my-2" />
        </div>
        <div className="col-md-3 col-sm-12">
          <label htmlFor="dtyp" className="my-2">
            Typ:
          </label>
          <select
            id="dtyp"
            className="form-select"
            onChange={(e) => onNewTypeChange(e.target.value)}
          >
            <option value="Wydatek">Wydatek</option>
            <option value="Przychód">Przychód</option>
          </select>
        </div>
        <div className="col-md-3 col-sm-12">
          <label htmlFor="dkategoria" className="my-2">
            Kategoria:
          </label>
          <input
            list="listaKategorii"
            className="form-control"
            onChange={(e) => onNewCategoryChange(e.target.value)}
          />
          <datalist id="listaKategorii">{options}</datalist>
        </div>
      </div>
      <div className="row justify-content-end">
        <div className="col-md-2 col-sm-12 mt-3">
          <button type="submit" className="container btn btn-light">
            Dodaj
          </button>
        </div>
      </div>
    </form>
  );
}
