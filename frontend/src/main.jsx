import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import Roles from "./pages/Roles";
import Auth from "./pages/Auth";

import Home from "./pages/tourist/Home";
import Discover from "./pages/tourist/Discover";
import Trips from "./pages/tourist/Trips";
import Guides from "./pages/tourist/Guides";
import Profile from "./pages/tourist/Profile";
import Planner from "./pages/tourist/Planner";

import {
  Home as HomeIcon,
  Compass,
  CalendarDays,
  Users,
  UserRound,
  LogOut
} from "lucide-react";

import "./style.css";

function TouristApp({ user, logout }) {
  const [page, setPage] = useState("home");

  function nav(nextPage) {
    setPage(nextPage);
  }

  function renderPage() {
    switch (page) {
      case "discover":
        return <Discover nav={nav} />;

      case "trips":
        return <Trips nav={nav} />;

      case "guides":
        return <Guides nav={nav} />;

      case "profile":
        return <Profile u={user} nav={nav} logout={logout} />;

     case "planner":
  return <Planner nav={nav} u={user} />;

      default:
        return <Home u={user} nav={nav} />;
    }
  }

  const navigation = [
    ["home", "Home", HomeIcon],
    ["discover", "Discover", Compass],
    ["trips", "Trips", CalendarDays],
    ["guides", "Guides", Users],
    ["profile", "Profile", UserRound]
  ];

  return (
    <div className="tourist-app">

      <main className="tourist-content">
        {renderPage()}
      </main>

      <nav className="bottom-nav">
        {navigation.map(([id, label, Icon]) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => nav(id)}
          >
            <Icon size={21} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}


function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("travelx_user") || "null"
      );
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(null);

  function logout() {
    localStorage.removeItem("travelx_token");
    localStorage.removeItem("travelx_user");

    setUser(null);
    setRole(null);
  }

  // Not logged in
  if (!user) {
    if (!role) {
      return <Roles choose={setRole} />;
    }

    return (
      <Auth
        role={role}
        back={() => setRole(null)}
        done={(newUser) => {
          setUser(newUser);
        }}
      />
    );
  }

  // Tourist application
  if (user.role === "tourist") {
    return (
      <TouristApp
        user={user}
        logout={logout}
      />
    );
  }

  // Temporary screen for other roles
  return (
    <div className="role-placeholder">
      <h1>TRAVELX AI</h1>

      <p>
        Welcome, {user.name || user.email}
      </p>

      <p>
        Role: {user.role}
      </p>

      <button onClick={logout}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);