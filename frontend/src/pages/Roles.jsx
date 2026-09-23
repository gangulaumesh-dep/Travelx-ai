import React from "react";
import {
  Compass,
  MapPinned,
  BriefcaseBusiness,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const roles = [
  {
    id: "tourist",
    title: "Tourist",
    description:
      "Discover places, plan trips and share new discoveries.",
    icon: Compass,
  },
  {
    id: "guide",
    title: "Local Guide",
    description:
      "Connect with travellers and offer authentic local experiences.",
    icon: MapPinned,
  },
  {
    id: "business",
    title: "Business",
    description:
      "Showcase your tourism business and manage bookings.",
    icon: BriefcaseBusiness,
  },
  {
    id: "admin",
    title: "Tourism Authority",
    description:
      "Manage tourism information and verification.",
    icon: ShieldCheck,
  },
];

function Roles({ choose }) {
  return (
    <main className="roles-page">
      <div className="roles-container">

        {/* Brand */}
        <header className="roles-header">
          <div className="roles-brand">
            TRAVEL<span>X</span>
            <b>AI</b>
          </div>

          <div className="roles-tagline">
            EXPLORE · EXPERIENCE · EXPAND
          </div>
        </header>

        {/* Hero */}
        <section className="roles-hero">
          <div className="roles-eyebrow">
            WELCOME TO TRAVELX
          </div>

          <h1>
            Travel starts <em>with you.</em>
          </h1>

          <p>
            Choose how you want to experience
            <br />
            the TRAVELX community.
          </p>
        </section>

        {/* Role cards */}
        <section className="roles-grid">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                className="role-card"
                onClick={() => choose(role.id)}
              >
                <div className={`role-icon ${role.id}`}>
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <div className="role-info">
                  <h2>{role.title}</h2>
                  <p>{role.description}</p>
                </div>

                <div className="role-arrow">
                  <ArrowRight size={18} />
                </div>
              </button>
            );
          })}
        </section>

        {/* Footer */}
        <footer className="roles-footer">
          <span>TRAVELX AI</span>
          <span>Discover better · Travel smarter · Empower locals</span>
        </footer>

      </div>
    </main>
  );
}

export default Roles;