import "../stylesheets/Navbar.css";
import PocketAILogo from "./PocketAILogo";

export default function Navbar({ menuBtnRef }) {
  return (
    <>
      <div className="navbar-container">
        <nav className="navbar">
          <div
            className="menu-btn"
            onClick={() => {
              menuBtnRef.current.classList.toggle("collapsed");
            }}
          >
            <i className="ti ti-menu-2"></i>
          </div>

          <div className="logo">
            <PocketAILogo />
            <span style={{'fontWeight': '800'}}>Pocket</span> <span style={{'color': '#4FD8FF', 'fontWeight': '800'}}>AI</span>
          </div>
        </nav>
      </div>
    </>
  );
}