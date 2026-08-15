import Orb from "../components/Orb";
import "../stylesheets/Dashboard.css";

export default function Dashboard() {
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-content">
          <div className="wish">
            <h2>
              Hello, <span className="username">Abrar</span>
            </h2>
            <h2>How can I help you today?</h2>
          </div>
          <Orb />
        </div>
      </div>
    </>
  );
}
