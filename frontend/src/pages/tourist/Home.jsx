import React from "react";
import {
  Bell,
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  MapPin,
  CloudSun,
  Luggage,
  Navigation,
  ShieldAlert,
  Hospital,
  Users
} from "lucide-react";

function Home({ u, nav }) {
  const name = u?.name || "Traveller";

  return (
    <section className="tourist-home">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="tourist-header">
        <div>
          <div className="brand-mini">
            TRAVEL<span>X</span> <b>AI</b>
          </div>

          <h1>👋 Hi, {name}!</h1>
          <p>Where do you want to go next?</p>
        </div>

        <button
          type="button"
          className="notification-btn"
          aria-label="Notifications"
        >
          <Bell size={21} />
          <span>2</span>
        </button>
      </div>


      {/* =====================================================
          SEARCH
          ===================================================== */}

      <div className="tourist-search">
        <Search size={20} aria-hidden="true" />

        <input
          type="text"
          placeholder="Search destination, place, activity..."
          aria-label="Search destination, place or activity"
        />

        <button
          type="button"
          aria-label="Search filters"
        >
          <SlidersHorizontal size={19} />
        </button>
      </div>


      {/* =====================================================
          AI TRIP PLANNER
          ===================================================== */}

      <div className="ai-trip-card">

        <div className="ai-trip-content">

          <div className="eyebrow">
            <Sparkles size={15} />
            TRAVELX AI
          </div>

          <h2>
            Plan Your Trip
            <br />
            with AI ✨
          </h2>

          <p>
            Tell us your destination, budget,
            <br />
            dates & interests.
            <br />
            We'll create the perfect itinerary.
          </p>

          <button
            type="button"
            className="trip-plan-button"
            onClick={() => nav("planner")}
          >
            Plan My Trip
            <ArrowRight size={18} />
          </button>

        </div>

        <div className="ai-visual" aria-hidden="true">
          <div className="ai-face">•ᴗ•</div>

          <span className="ai-star star-1">✦</span>
          <span className="ai-star star-2">✦</span>
          <span className="ai-star star-3">✧</span>
        </div>

      </div>


      {/* =====================================================
          WEATHER
          ===================================================== */}

      <div className="weather-card">

        <div className="weather-main">

          <div className="weather-icon">
            <CloudSun size={26} />
          </div>

          <div>
            <small>YOUR LOCATION</small>

            <h3>
              <MapPin size={15} />
              Weather near you
            </h3>
          </div>

        </div>

        <div className="weather-value">
          <strong>--°</strong>

          <div>
            <b>Enable location</b>
            <span>to see local weather</span>
          </div>
        </div>

        <button
          type="button"
          className="location-button"
        >
          <Navigation size={16} />
          Enable Location
        </button>

      </div>


      {/* =====================================================
          YOUR TRIPS
          ===================================================== */}

      <div className="section-heading">
        <h2>Your Trips</h2>

        <button
          type="button"
          onClick={() => nav("trips")}
        >
          View all
        </button>
      </div>


      <div className="trip-empty-card">

        <div className="trip-empty-icon">
          <Luggage size={27} />
        </div>

        <div className="trip-empty-text">
          <h3>You don't have a trip yet!</h3>
          <p>Create your first AI-powered journey.</p>
        </div>

        <button
          type="button"
          onClick={() => nav("planner")}
        >
          Start Planning
        </button>

      </div>


      {/* =====================================================
          LOCAL GUIDE + SMART SUGGESTION
          ===================================================== */}

      <div className="home-feature-grid">

        {/* LOCAL GUIDES */}

        <div className="home-feature guide-feature">

          <div className="feature-icon">
            <Users size={23} />
          </div>

          <h3>Find Local Guide</h3>

          <p>
            Explore with verified
            <br />
            local experts.
          </p>

          <button
            type="button"
            onClick={() => nav("guides")}
          >
            Find Guides
            <ArrowRight size={15} />
          </button>

        </div>


        {/* SMART SUGGESTION */}

        <div className="home-feature suggestion-feature">

          <div className="feature-icon">
            <Sparkles size={23} />
          </div>

          <h3>Today's Smart Suggestion</h3>

          <p>
            Discover a better experience
            based on your destination.
          </p>

          <button
            type="button"
            onClick={() => nav("discover")}
          >
            Explore Now
            <ArrowRight size={15} />
          </button>

        </div>

      </div>


      {/* =====================================================
          QUICK SAFETY ACCESS
          ===================================================== */}

      <div className="section-heading safety-heading">
        <h2>Quick Safety Access</h2>
      </div>


      <div className="safety-grid">

        {/* SOS */}

        <button
          type="button"
          className="safety-card sos"
        >
          <ShieldAlert size={23} />

          <div>
            <strong>SOS</strong>
            <span>Emergency</span>
          </div>
        </button>


        {/* SHARE LOCATION */}

        <button
          type="button"
          className="safety-card location"
        >
          <Navigation size={22} />

          <div>
            <strong>Share Location</strong>
            <span>With Family</span>
          </div>
        </button>


        {/* HOSPITALS */}

        <button
          type="button"
          className="safety-card hospital"
        >
          <Hospital size={22} />

          <div>
            <strong>Nearby Hospitals</strong>
            <span>&amp; Help</span>
          </div>
        </button>

      </div>


      {/* =====================================================
          TRAVELX MISSION
          ===================================================== */}

      <div className="home-mission">
        <Sparkles size={17} />

        <span>
          Discover better. Travel smarter. Empower locals.
        </span>
      </div>

    </section>
  );
}

export default Home;