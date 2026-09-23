import React from "react";

function Profile({ u, nav, logout }) {
  return (
    <section className="page-placeholder">
      <h1>Profile</h1>

      <p>
        {u?.name || "Traveller"}
      </p>

      <p>
        {u?.email || ""}
      </p>

      <button onClick={() => nav("home")}>
        ← Back to Home
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </section>
  );
}

export default Profile;