import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { logout, name } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (!confirmed) return;
    logout();
    navigate("/login", { replace: true });
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: "ti-layout-dashboard" },
    { to: "/admin/content", label: "Content Review", icon: "ti-file-text" },
    { to: "/admin/brand", label: "Brand Settings", icon: "ti-palette" },
  ];

  const pageLabel = navItems.find((n) => n.to === location.pathname)?.label || "Dashboard";

  return (
    <div className="admin">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <div className="adm-brand-name">
            <div className="adm-brand-dot" />
            Travel Agent
          </div>
        </div>

        <nav className="adm-nav">
          <div className="adm-nav-section-label">Main</div>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`adm-nav-item${location.pathname === item.to ? " active" : ""}`}
            >
              <i className={`ti ${item.icon}`} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <button type="button" className="adm-signout" onClick={handleLogout}>
          <i className="ti ti-logout" aria-hidden="true" />
          Sign out
        </button>
      </aside>

      <main>
        <header className="adm-topbar">
          <div className="adm-breadcrumb">
            Admin <i className="ti ti-chevron-right" /> <span>{pageLabel}</span>
          </div>
          <div className="adm-topbar-right">
            <Link to="/" className="adm-public-link">
              <i className="ti ti-external-link" aria-hidden="true" />
              Public Site
            </Link>
            <span className="adm-welcome">Welcome, {name || "Admin"}</span>
            <div className="adm-avatar">{initials}</div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}