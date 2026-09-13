import logo from "@/assets/fusion logo.png";
import { useGetMeQuery, useLogoutMutation } from "@/features/auth/authApi";
import {
  Bell,
  ChevronRight,
  Fuel,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  Boxes,
  Tag,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
const nav = [
  ["/", "Dashboard", LayoutDashboard],
  ["/sale", "Sales", Tag],
  ["/purchase", "Purchases", ShoppingCart],
  ["/service", "Services", Wrench],
  ["/stock", "Stock", Boxes],
  ["/petrol-expense", "Petrol Expense", Fuel],
  ["/smc-expense", "SMC Expense", WalletCards],
  ["/other-expense", "Other Expense", WalletCards],
  ["/payment-status", "Payments", WalletCards],
];
export default function Layout() {
  const [open, setOpen] = useState(false);
  const navg = useNavigate();
  const { data } = useGetMeQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const doLogout = async () => {
    await logout();
    navg("/admin/login", { replace: true });
  };
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <img src={logo} />
          <div>
            <b>FUSION</b>
            <span>Enterprise</span>
          </div>
          <button
            className="icon-btn mobile-only"
            onClick={() => setOpen(false)}
          >
            <X size={19} />
          </button>
        </div>
        <div className="workspace">
          <span className="dot" /> Business Management
        </div>
        <nav>
          {nav.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Payments" && <span className="nav-badge">LIVE</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="avatar">
              {(data?.user?.username || "A")[0].toUpperCase()}
            </div>
            <div>
              <b>{data?.user?.username || "Admin"}</b>
              <span>{data?.user?.email || "Administrator"}</span>
            </div>
          </div>
          <button className="logout" onClick={doLogout} disabled={isLoading}>
            <LogOut size={17} />
            {isLoading ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <button
            className="icon-btn mobile-only"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <div className="crumb">
            <span>Fusion</span>
            <ChevronRight size={15} />
            <b>Workspace</b>
          </div>
          <div className="top-actions">
            <div className="online">
              <span /> System online
            </div>
            <button className="icon-btn">
              <Bell size={18} />
            </button>
            <div className="top-avatar">
              {(data?.user?.username || "A")[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
      {open && (
        <div className="mobile-overlay" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
