import React, { useState } from "react";
import { Compass, MapPinned, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { auth } from "../api";

const roleInfo = {
  tourist: {
    name: "Tourist",
    icon: Compass,
    description: "Discover places, plan trips and share new discoveries.",
  },
  guide: {
    name: "Local Guide",
    icon: MapPinned,
    description: "Connect with travellers and offer authentic local experiences.",
  },
  business: {
    name: "Business",
    icon: BriefcaseBusiness,
    description: "Showcase your tourism business and manage bookings.",
  },
  admin: {
    name: "Tourism Authority",
    icon: ShieldCheck,
    description: "Manage tourism information and verification.",
  },
};

function Auth({ role, back, done }) {
  const info = roleInfo[role];
  const Icon = info.icon;

  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      const form = new FormData(e.currentTarget);

      const data = {
        email: form.get("email"),
        password: form.get("password"),
        role,
      };

      if (register) {
        data.name = form.get("name");
      }

      const result = register
        ? await auth.register(data)
        : await auth.login(data);

      localStorage.setItem("travelx_token", result.token);
      localStorage.setItem(
        "travelx_user",
        JSON.stringify(result.user)
      );

      done(result.user);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function switchMode(value) {
    setRegister(value);
    setError("");
  }

  return (
    <main className="auth-page">

      <div className="auth-container">

        {/* Header */}
        <header className="auth-header">
          <div className="auth-brand">
            TRAVEL<span>X</span>
            <b>AI</b>
          </div>

          <div className="auth-tagline">
            EXPLORE · EXPERIENCE · EXPAND
          </div>
        </header>

        {/* Back */}
        <button className="auth-back" onClick={back}>
          ← Back
        </button>

        {/* Card */}
        <section className="auth-card">

          <div className={`auth-icon ${role}`}>
            <Icon size={27} strokeWidth={1.8} />
          </div>

          <div className="auth-role">
            {info.name.toUpperCase()}
          </div>

          <h1>
            {register ? (
              <>
                Create your <em>account.</em>
              </>
            ) : (
              <>
                Welcome <em>back.</em>
              </>
            )}
          </h1>

          <p className="auth-description">
            {info.description}
          </p>

          {/* Login / Register tabs */}
          {role !== "admin" && (
            <div className="auth-tabs">
              <button
                className={!register ? "active" : ""}
                onClick={() => switchMode(false)}
                type="button"
              >
                Login
              </button>

              <button
                className={register ? "active" : ""}
                onClick={() => switchMode(true)}
                type="button"
              >
                Register
              </button>
            </div>
          )}

          <form onSubmit={submit} className="auth-form">

            {register && (
              <label>
                Full name
                <input
                  required
                  name="name"
                  placeholder="Enter your full name"
                />
              </label>
            )}

            <label>
              Email
              <input
                required
                name="email"
                type="email"
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <input
                required
                name="password"
                type="password"
                minLength="6"
                placeholder="Enter your password"
              />
            </label>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              className="auth-submit"
              disabled={busy}
              type="submit"
            >
              {busy
                ? "Please wait..."
                : register
                  ? "Create Account"
                  : "Login"}
            </button>

          </form>

          {role !== "admin" && (
            <div className="auth-switch">
              {register
                ? "Already have an account?"
                : "New to TRAVELX?"}

              <button
                type="button"
                onClick={() => switchMode(!register)}
              >
                {register ? "Login" : "Register"}
              </button>
            </div>
          )}

        </section>

        <footer className="auth-footer">
          <span>TRAVELX AI</span>
          <span>Discover better · Travel smarter · Empower locals</span>
        </footer>

      </div>

    </main>
  );
}

export default Auth;