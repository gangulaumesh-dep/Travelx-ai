import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  MapPin,
  Compass,
  Sparkles,
  ChevronRight,
  Plus,
  BadgeCheck
} from "lucide-react";
import { api } from "../../api";

function Discover({ nav }) {
  const [discoveries, setDiscoveries] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDiscoveries();
  }, []);

  async function loadDiscoveries() {
    try {
      setLoading(true);
      setError("");

      const data = await api("/discoveries");

      setDiscoveries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load discoveries.");
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const values = discoveries
      .map((item) => item.category)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [discoveries]);

  const filteredDiscoveries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return discoveries.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;

      const searchableText = [
        item.title,
        item.description,
        item.category,
        item.city,
        item.state,
        item.submitted_by
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [discoveries, search, category]);

  return (
    <section className="discover-page">

      {/* TOP BAR */}

      <div className="discover-topbar">

        <button
          className="discover-back"
          onClick={() => nav("home")}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="discover-brand">
          TRAVEL<span>X</span> <b>AI</b>
        </div>

      </div>


      {/* HERO */}

      <div className="discover-hero">

        <div className="discover-eyebrow">
          <Compass size={15} />
          TRAVELX DISCOVERIES
        </div>

        <h1>
          Discover places
          <br />
          <em>worth experiencing.</em>
        </h1>

        <p>
          Find hidden places, local experiences and
          <br />
          discoveries shared by the TRAVELX community.
        </p>

      </div>


      {/* SEARCH */}

      <div className="discover-search">

        <Search size={19} />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search places, cities, experiences..."
        />

        <button
          type="button"
          aria-label="Filter"
        >
          <SlidersHorizontal size={18} />
        </button>

      </div>


      {/* CATEGORIES */}

      <div className="discover-categories">

        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}

      </div>


      {/* FEATURED */}

      <div className="discover-section-heading">

        <div>
          <small>EXPLORE</small>
          <h2>Featured Discoveries</h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setCategory("All");
            setSearch("");
          }}
        >
          View all
          <ChevronRight size={15} />
        </button>

      </div>


      {!loading &&
        !error &&
        filteredDiscoveries.length > 0 && (

          <div className="discover-featured">

            {filteredDiscoveries
              .slice(0, 3)
              .map((item) => (
                <DiscoveryCard
                  key={item.id}
                  item={item}
                  featured
                />
              ))}

          </div>
        )}


      {/* COMMUNITY */}

      <div className="discover-section-heading community-heading">

        <div>
          <small>FROM THE COMMUNITY</small>
          <h2>Community Discoveries</h2>
        </div>

        <span>
          {loading ? "Loading..." : `${filteredDiscoveries.length} found`}
        </span>

      </div>


      {/* LOADING */}

      {loading && (

        <div className="discover-message">

          <Sparkles size={19} />

          <div>
            <strong>Finding discoveries...</strong>
            <span>
              Loading places shared by the community.
            </span>
          </div>

        </div>

      )}


      {/* ERROR */}

      {!loading && error && (

        <div className="discover-message error">

          <div>
            <strong>Couldn't load discoveries</strong>
            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={loadDiscoveries}
          >
            Try again
          </button>

        </div>

      )}


      {/* EMPTY */}

      {!loading &&
        !error &&
        filteredDiscoveries.length === 0 && (

          <div className="discover-empty">

            <div className="discover-empty-icon">
              <Compass size={28} />
            </div>

            <h3>No discoveries found</h3>

            <p>
              Try another search or choose a different category.
            </p>

            {(search || category !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            )}

          </div>
        )}


      {/* COMMUNITY GRID */}

      {!loading &&
        !error &&
        filteredDiscoveries.length > 0 && (

          <div className="discover-grid">

            {filteredDiscoveries.map((item) => (
              <DiscoveryCard
                key={item.id}
                item={item}
              />
            ))}

          </div>
        )}


      {/* MAP PREVIEW */}

      <div className="discover-map-section">

        <div className="discover-section-heading">

          <div>
            <small>EXPLORE LOCATIONS</small>
            <h2>Discover on Map</h2>
          </div>

        </div>

        <div className="discover-map-card">

          <div className="map-pattern">

            <div className="map-line line-one" />
            <div className="map-line line-two" />
            <div className="map-line line-three" />

            <span className="map-pin pin-one">
              <MapPin size={18} />
            </span>

            <span className="map-pin pin-two">
              <MapPin size={18} />
            </span>

            <span className="map-pin pin-three">
              <MapPin size={18} />
            </span>

            <div className="map-overlay">

              <Compass size={21} />

              <div>
                <strong>Explore places around you</strong>
                <span>
                  Discover hidden locations on the TRAVELX map.
                </span>
              </div>

              <button type="button">
                Open Map
                <ChevronRight size={16} />
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ADD DISCOVERY */}

      <div className="discover-community-card">

        <div className="discover-community-icon">
          <Plus size={23} />
        </div>

        <div className="discover-community-content">

          <small>KNOW A HIDDEN PLACE?</small>

          <h3>
            Share your discovery with TRAVELX.
          </h3>

          <p>
            Help other travellers discover places
            that deserve to be experienced.
          </p>

        </div>

        <button
          type="button"
          onClick={() => nav("new")}
        >
          Add Discovery
          <ChevronRight size={17} />
        </button>

      </div>


      {/* FOOTER */}

      <div className="discover-footer">

        <Sparkles size={15} />

        <span>
          Discover better. Travel smarter. Empower locals.
        </span>

      </div>

    </section>
  );
}


/* =========================================================
   DISCOVERY CARD
   ========================================================= */

function DiscoveryCard({ item, featured = false }) {
  const location = [
    item.city,
    item.state
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className={
        featured
          ? "discovery-card featured"
          : "discovery-card"
      }
    >

      {/* IMAGE AREA */}

      <div className="discovery-image">

        <div className="discovery-image-placeholder">
          <Compass size={32} />
        </div>

        <span className="discovery-category">
          {item.category || "Local Experience"}
        </span>

        {item.status === "approved" && (
          <span className="discovery-verified">
            <BadgeCheck size={14} />
            Verified
          </span>
        )}

      </div>


      {/* CONTENT */}

      <div className="discovery-content">

        <div className="discovery-location">

          <MapPin size={14} />

          <span>
            {location || "Location available"}
          </span>

        </div>

        <h3>
          {item.title || "Untitled Discovery"}
        </h3>

        <p>
          {item.description ||
            "A local discovery shared by the TRAVELX community."}
        </p>


        <div className="discovery-footer">

          <small>
            Shared by{" "}
            <b>
              {item.submitted_by || "TRAVELX traveller"}
            </b>
          </small>

          <button type="button">
            Explore
            <ChevronRight size={15} />
          </button>

        </div>

      </div>

    </article>
  );
}

export default Discover;