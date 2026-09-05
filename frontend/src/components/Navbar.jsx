import "../stylesheets/Navbar.css";
import FridayLogo from "./Friday";

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
            <FridayLogo />
            <span style={{'fontWeight': '800'}}>Friday</span> <span style={{'color': '#4FD8FF', 'fontWeight': '800'}}>AI</span>
          </div>
        </nav>
      </div>
    </>
  );
}