export default function TitleBar({ title, icon }) {
  return (
    <div className="d-flex flex-fill align-self-stretch mb-5 sticky-top">
      <div className="container">
        <h1 className="my-3">
          <i className="bi bi-piggy-bank-fill me-3" />
          Skarbonka
        </h1>
      </div>
    </div>
  );
}
