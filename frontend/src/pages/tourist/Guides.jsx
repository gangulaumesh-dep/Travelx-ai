import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock3,
  Languages,
  MapPin,
  Search,
  Star,
  Users,
  Sparkles,
  MessageCircle,
  CalendarDays,
  X,
  ShieldCheck,
} from "lucide-react";

const guides = [
  {
    id: 1,
    name: "Arjun Rao",
    city: "Araku Valley",
    rating: "4.9",
    reviews: 128,
    experience: "6 years",
    languages: ["English", "Telugu", "Hindi"],
    specialty: "Nature & Adventure",
    verified: true,
    initials: "AR",
    price: 2000,
    bio: "Local expert helping travellers discover Araku's hidden valleys, viewpoints, tribal culture and authentic local experiences.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    city: "Visakhapatnam",
    rating: "4.8",
    reviews: 94,
    experience: "5 years",
    languages: ["English", "Hindi", "Telugu"],
    specialty: "Culture & Food",
    verified: true,
    initials: "PS",
    price: 1800,
    bio: "Passionate local guide focused on Visakhapatnam's food, beaches, culture and lesser-known experiences.",
  },
  {
    id: 3,
    name: "Kiran Kumar",
    city: "Hyderabad",
    rating: "4.7",
    reviews: 76,
    experience: "4 years",
    languages: ["Telugu", "English"],
    specialty: "City Experiences",
    verified: true,
    initials: "KK",
    price: 1500,
    bio: "Explore Hyderabad beyond the usual tourist spots with a local who knows the city's food, history and hidden corners.",
  },
  {
    id: 4,
    name: "Meera Reddy",
    city: "Vijayawada",
    rating: "4.9",
    reviews: 61,
    experience: "7 years",
    languages: ["English", "Telugu"],
    specialty: "Heritage & Culture",
    verified: true,
    initials: "MR",
    price: 1700,
    bio: "Heritage-focused guide offering authentic cultural experiences and stories around Vijayawada and nearby destinations.",
  },
];

const filters = ["All", "Verified", "Popular", "Nearby"];

function Guides({ nav }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedGuide, setSelectedGuide] = useState(null);
  const [messageGuide, setMessageGuide] = useState(null);
  const [bookingGuide, setBookingGuide] = useState(null);

  const [message, setMessage] = useState("");

  const filteredGuides = useMemo(() => {
    const query = search.trim().toLowerCase();

    return guides.filter((guide) => {
      const matchesSearch =
        !query ||
        guide.name.toLowerCase().includes(query) ||
        guide.city.toLowerCase().includes(query) ||
        guide.specialty.toLowerCase().includes(query) ||
        guide.languages.some((language) =>
          language.toLowerCase().includes(query)
        );

      let matchesFilter = true;

      if (filter === "Verified") {
        matchesFilter = guide.verified;
      }

      if (filter === "Popular") {
        matchesFilter = Number(guide.rating) >= 4.8;
      }

      // Real nearby filtering will be connected to
      // location/GPS later.
      if (filter === "Nearby") {
        matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const closeModals = () => {
    setSelectedGuide(null);
    setMessageGuide(null);
    setBookingGuide(null);
    setMessage("");
  };

  return (
    <section className="guides-page">

      {/* HEADER */}
      <div className="guides-topbar">
        <button
          className="guides-back"
          onClick={() => nav("home")}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="guides-brand">
          TRAVEL<span>X</span> <b>AI</b>
        </div>

        <div className="guides-top-spacer" />
      </div>


      {/* HERO */}
      <div className="guides-hero">

        <div className="guides-eyebrow">
          <Users size={15} />
          TRAVELX GUIDES
        </div>

        <h1>
          Meet your
          <br />
          <em>local guides.</em>
        </h1>

        <p>
          Explore with people who know the place,
          <br />
          culture and stories like a local.
        </p>

      </div>


      {/* SEARCH */}
      <div className="guides-search">

        <Search size={19} />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guides, city, language..."
        />

      </div>


      {/* FILTERS */}
      <div className="guides-filters">

        {filters.map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}

      </div>


      {/* SECTION HEADING */}
      <div className="guides-section-heading">

        <div>
          <span>RECOMMENDED FOR YOU</span>
          <h2>Featured Guides</h2>
        </div>

        <small>
          {filteredGuides.length} guides
        </small>

      </div>


      {/* GUIDE CARDS */}
      <div className="guides-grid">

        {filteredGuides.map((guide) => (
          <article
            className="guide-card"
            key={guide.id}
          >

            <div className="guide-card-top">

              <div className="guide-avatar">
                {guide.initials}
              </div>

              {guide.verified && (
                <div className="guide-verified">
                  <BadgeCheck size={14} />
                  Verified
                </div>
              )}

            </div>


            <div className="guide-info">

              <h3>{guide.name}</h3>

              <div className="guide-location">
                <MapPin size={14} />
                {guide.city}
              </div>

              <div className="guide-rating">
                <Star size={14} fill="currentColor" />
                <strong>{guide.rating}</strong>
                <span>({guide.reviews} reviews)</span>
              </div>

              <div className="guide-specialty">
                {guide.specialty}
              </div>


              <div className="guide-details">

                <div>
                  <Clock3 size={14} />
                  <span>{guide.experience}</span>
                </div>

                <div>
                  <Languages size={14} />
                  <span>{guide.languages.length} languages</span>
                </div>

              </div>


              <div className="guide-languages">

                {guide.languages.map((language) => (
                  <span key={language}>
                    {language}
                  </span>
                ))}

              </div>


              {/* PRICE */}
              <div className="guide-price">
                <strong>₹{guide.price.toLocaleString()}</strong>
                <span>per day</span>
              </div>

            </div>


            {/* ACTIONS */}
            <div className="guide-card-actions">

              <button
                className="guide-message-button"
                onClick={() => setMessageGuide(guide)}
              >
                <MessageCircle size={15} />
                Message
              </button>

              <button
                className="guide-profile-button"
                onClick={() => setSelectedGuide(guide)}
              >
                View Profile
                <ArrowRight size={16} />
              </button>

            </div>

          </article>
        ))}

      </div>


      {/* EMPTY STATE */}
      {filteredGuides.length === 0 && (
        <div className="guides-empty">

          <Search size={28} />

          <h3>No guides found</h3>

          <p>
            Try another city, language or guide name.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
          >
            Clear Search
          </button>

        </div>
      )}


      {/* WHY LOCAL GUIDE */}
      <section className="why-guide">

        <div className="why-guide-icon">
          <Sparkles size={23} />
        </div>

        <div>
          <span>THE TRAVELX DIFFERENCE</span>

          <h2>
            Travel like a local.
          </h2>

          <p>
            Discover hidden places, authentic food and
            experiences that you may never find alone.
          </p>
        </div>

      </section>


      {/* BECOME GUIDE */}
      <section className="become-guide">

        <div>

          <span>ARE YOU A LOCAL EXPERT?</span>

          <h2>
            Share your place with the world.
          </h2>

          <p>
            Become a TRAVELX guide and help travellers
            experience your destination authentically.
          </p>

        </div>

        <button>
          Become a Guide
          <ArrowRight size={17} />
        </button>

      </section>


      {/* FOOTER */}
      <div className="guides-mission">
        <Sparkles size={15} />
        Discover better. Travel smarter. Empower locals.
      </div>


      {/* =====================================================
          GUIDE PROFILE MODAL
         ===================================================== */}

      {selectedGuide && (
        <div
          className="guide-modal-overlay"
          onClick={closeModals}
        >

          <div
            className="guide-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="guide-modal-close"
              onClick={closeModals}
            >
              <X size={19} />
            </button>


            <div className="profile-modal-header">

              <div className="profile-modal-avatar">
                {selectedGuide.initials}
              </div>

              <div>

                <div className="profile-modal-name">
                  <h2>{selectedGuide.name}</h2>

                  {selectedGuide.verified && (
                    <BadgeCheck size={18} />
                  )}
                </div>

                <div className="profile-modal-location">
                  <MapPin size={14} />
                  {selectedGuide.city}
                </div>

              </div>

            </div>


            <div className="profile-rating-box">

              <Star size={17} fill="currentColor" />

              <strong>{selectedGuide.rating}</strong>

              <span>
                {selectedGuide.reviews} reviews
              </span>

            </div>


            <div className="profile-modal-section">

              <span>ABOUT THE GUIDE</span>

              <p>
                {selectedGuide.bio}
              </p>

            </div>


            <div className="profile-modal-grid">

              <div>
                <Clock3 size={17} />
                <span>Experience</span>
                <strong>{selectedGuide.experience}</strong>
              </div>

              <div>
                <Languages size={17} />
                <span>Languages</span>
                <strong>
                  {selectedGuide.languages.length}
                </strong>
              </div>

              <div>
                <Sparkles size={17} />
                <span>Specialty</span>
                <strong>
                  {selectedGuide.specialty}
                </strong>
              </div>

              <div>
                <CalendarDays size={17} />
                <span>Guide Fee</span>
                <strong>
                  ₹{selectedGuide.price.toLocaleString()}/day
                </strong>
              </div>

            </div>


            <div className="profile-language-list">

              {selectedGuide.languages.map((language) => (
                <span key={language}>
                  {language}
                </span>
              ))}

            </div>


            <div className="profile-security-note">
              <ShieldCheck size={17} />

              <span>
                Guide contact details remain private until
                a booking is confirmed.
              </span>
            </div>


            <div className="profile-modal-actions">

              <button
                className="guide-message-large"
                onClick={() => {
                  setMessageGuide(selectedGuide);
                  setSelectedGuide(null);
                }}
              >
                <MessageCircle size={17} />
                Message Guide
              </button>

              <button
                className="guide-book-large"
                onClick={() => {
                  setBookingGuide(selectedGuide);
                  setSelectedGuide(null);
                }}
              >
                Book Guide
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          MESSAGE MODAL
         ===================================================== */}

      {messageGuide && (
        <div
          className="guide-modal-overlay"
          onClick={closeModals}
        >

          <div
            className="guide-modal message-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="guide-modal-close"
              onClick={closeModals}
            >
              <X size={19} />
            </button>


            <div className="modal-icon message-icon">
              <MessageCircle size={24} />
            </div>

            <span className="modal-eyebrow">
              TRAVELX MESSAGES
            </span>

            <h2>
              Message {messageGuide.name}
            </h2>

            <p className="modal-description">
              Ask about availability, experiences, pricing or
              anything you want to know before booking.
            </p>


            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={5}
            />


            <div className="message-privacy">
              <ShieldCheck size={16} />
              Phone numbers are kept private.
            </div>


            <button
              className="modal-primary-button"
              disabled={!message.trim()}
              onClick={() => {
                alert(
                  "Message feature will connect to the TRAVELX backend next."
                );
                closeModals();
              }}
            >
              Send Message
              <ArrowRight size={17} />
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          BOOKING MODAL
         ===================================================== */}

      {bookingGuide && (
        <div
          className="guide-modal-overlay"
          onClick={closeModals}
        >

          <div
            className="guide-modal booking-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="guide-modal-close"
              onClick={closeModals}
            >
              <X size={19} />
            </button>


            <div className="modal-icon booking-icon">
              <CalendarDays size={24} />
            </div>

            <span className="modal-eyebrow">
              BOOK A LOCAL GUIDE
            </span>

            <h2>
              {bookingGuide.name}
            </h2>

            <p className="modal-description">
              Request a local guide for your upcoming trip.
            </p>


            <div className="booking-summary">

              <div>
                <span>Destination</span>
                <strong>{bookingGuide.city}</strong>
              </div>

              <div>
                <span>Guide fee</span>
                <strong>
                  ₹{bookingGuide.price.toLocaleString()} / day
                </strong>
              </div>

            </div>


            <label className="booking-label">
              Number of days

              <select defaultValue="1">
                <option value="1">1 day</option>
                <option value="2">2 days</option>
                <option value="3">3 days</option>
                <option value="4">4 days</option>
                <option value="5">5 days</option>
                <option value="6">6 days</option>
                <option value="7">7 days</option>
              </select>

            </label>


            <div className="booking-note">
              <ShieldCheck size={17} />

              <span>
                The guide's phone number will only be shared
                after the booking is confirmed.
              </span>
            </div>


            <button
              className="modal-primary-button"
              onClick={() => {
                alert(
                  "Booking flow will connect to the TRAVELX backend next."
                );
                closeModals();
              }}
            >
              Request Booking
              <ArrowRight size={17} />
            </button>

          </div>

        </div>
      )}

    </section>
  );
}

export default Guides;