export default function TitleBar({ title, icon }) {
  return (
    <div className="d-flex flex-fill align-self-stretch mb-5 sticky-top bg-white">
      <div className="container">
        <h1 className="my-3">
          <i className={icon} />
          {title}
        </h1>
      </div>
    </div>
  );
}
