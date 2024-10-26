import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import TitleBar from "./components/TitleBar";
import EditableTransactionTable from "./components/EditableTransactionTable";

export default function App() {
  return (
    <>
      <TitleBar title="Skarbonka" icon="bi bi-piggy-bank-fill"></TitleBar>
      <EditableTransactionTable />
    </>
  );
}
