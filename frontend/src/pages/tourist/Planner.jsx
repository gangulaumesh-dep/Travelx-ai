import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  CloudSun,
  ExternalLink,
  Hotel,
  MapPin,
  Minus,
  Navigation,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  Wallet,
  Utensils,
  TrainFront,
  BusFront,
  Plane,
  Car,
  Search,
} from "lucide-react";

/* =========================================================
   TRAVEL GROUPS
   ========================================================= */

const groupOptions = [
  {
    id: "solo",
    label: "Solo",
    icon: "🧍",
    description: "Just me",
  },
  {
    id: "couple",
    label: "Couple",
    icon: "❤️",
    description: "Two travellers",
  },
  {
    id: "friends",
    label: "Friends",
    icon: "👫",
    description: "Travel with friends",
  },
  {
    id: "family",
    label: "Family",
    icon: "👨‍👩‍👧",
    description: "Family journey",
  },
  {
    id: "group",
    label: "Other / Group",
    icon: "👥",
    description: "Larger group",
  },
];

/* =========================================================
   INTERESTS
   ========================================================= */

const interests = [
  "Nature",
  "Adventure",
  "Culture",
  "Food",
  "Heritage",
  "Shopping",
  "Photography",
  "Relaxation",
];

/* =========================================================
   DESTINATION SUGGESTIONS
   ========================================================= */

const destinations = [
  "Hyderabad",
  "Vijayawada",
  "Visakhapatnam",
  "Araku Valley",
  "Tirupati",
  "Warangal",
  "Chennai",
  "Bengaluru",
  "Goa",
  "Munnar",
  "Ooty",
  "Coorg",
];

/* =========================================================
   DEMO TRANSPORT
   ========================================================= */

const transportOptions = [
  {
    id: "train",
    type: "Train",
    name: "TRAVELX Express",
    description: "Comfortable intercity rail journey.",
    price: 650,
    duration: "5h 20m",
    icon: TrainFront,
    bookingQuery: "official Indian Railways train booking",
  },
  {
    id: "bus",
    type: "Bus",
    name: "TRAVELX Sleeper Bus",
    description: "Affordable direct bus journey.",
    price: 450,
    duration: "6h 10m",
    icon: BusFront,
    bookingQuery: "official bus booking India",
  },
  {
    id: "flight",
    type: "Flight",
    name: "TRAVELX Air Demo",
    description: "Fast option for longer journeys.",
    price: 3200,
    duration: "1h 20m",
    icon: Plane,
    bookingQuery: "official airline booking India",
  },
  {
    id: "own",
    type: "Own Vehicle",
    name: "Your Own Vehicle",
    description: "Travel independently at your own pace.",
    price: 0,
    duration: "Flexible",
    icon: Car,
    bookingQuery: "fuel stations India",
  },
];

/* =========================================================
   DEMO HOTEL
   ₹1,200 / NIGHT / ROOM
   1 ROOM = UP TO 4 PEOPLE
   ========================================================= */

const demoHotels = [
  {
    id: 1,
    name: "TRAVELX Grand Stay",
    description:
      "Comfortable city accommodation for travellers.",
    price: 1200,
    distance: "0.7 km from centre",
    rating: "4.8",
    capacity: 4,
  },
];

/* =========================================================
   DEMO GUIDE
   ₹300 / DAY
   ========================================================= */

const demoGuide = {
  id: 1,
  name: "Arjun Rao",
  rating: "4.9",
  reviews: 128,
  pricePerDay: 300,
  experience: "6 years",
  languages: ["English", "Telugu", "Hindi"],
  specialty: "Nature & Local Experiences",
  initials: "AR",
};

/* =========================================================
   DEMO RESTAURANTS
   ========================================================= */

const demoRestaurants = [
  {
    name: "TRAVELX Local Kitchen",
    type: "Local Food",
  },
  {
    name: "TRAVELX Garden Restaurant",
    type: "Family Dining",
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

function getDays(startDate, endDate) {
  if (!startDate || !endDate) return 1;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const difference = Math.round(
    (end - start) / (1000 * 60 * 60 * 24)
  );

  return Math.max(1, difference + 1);
}

function formatDate(date) {
  if (!date) return "";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

/* =========================================================
   MAIN PLANNER
   ========================================================= */

function Planner({ nav, u }) {
  const [step, setStep] = useState(1);

  /* STEP 1 */
  const [travellers, setTravellers] = useState(2);
  const [groupType, setGroupType] = useState("couple");

  /* STEP 2 */
  const [fromLocation, setFromLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);

  /* STEP 3 */
  const [transport, setTransport] = useState(null);

  /* STEP 4 */
  const [budget, setBudget] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);

  /* STEP 5 */
  const [wantsGuide, setWantsGuide] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  /* FINAL */
  const [savedTrip, setSavedTrip] = useState(false);

  const days = useMemo(
    () => getDays(startDate, endDate),
    [startDate, endDate]
  );

  const hotelRooms = Math.max(
    1,
    Math.ceil(travellers / 4)
  );

  const hotelNights = Math.max(days - 1, 1);

  const hotelCost = selectedHotel
    ? selectedHotel.price *
      hotelRooms *
      hotelNights
    : 0;

  const transportCost = transport
    ? transport.price
    : 0;

  const guideCost =
    wantsGuide && selectedGuide
      ? selectedGuide.pricePerDay * days
      : 0;

  const activityAllocation = Math.round(
    Number(budget || 0) * 0.35
  );

  const estimatedTotal =
    transportCost +
    hotelCost +
    guideCost +
    activityAllocation;

  /* =======================================================
     DESTINATION AUTOCOMPLETE
     ======================================================= */

  const destinationSuggestions = useMemo(() => {
    const query = destination
      .trim()
      .toLowerCase();

    if (!query) return [];

    return destinations
      .filter((place) =>
        place.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [destination]);

  /* =======================================================
     FROM AUTOCOMPLETE
     ======================================================= */

  const fromSuggestions = useMemo(() => {
    const query = fromLocation
      .trim()
      .toLowerCase();

    if (!query) return [];

    return destinations
      .filter((place) =>
        place.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [fromLocation]);

  /* =======================================================
     INTEREST TOGGLE
     ======================================================= */

  const toggleInterest = (interest) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter(
            (item) => item !== interest
          )
        : [...current, interest]
    );
  };

  /* =======================================================
     NAVIGATION
     ======================================================= */

  const nextStep = () => {
    setStep((current) =>
      Math.min(current + 1, 6)
    );
  };

  const previousStep = () => {
    setStep((current) =>
      Math.max(current - 1, 1)
    );
  };

  /* =======================================================
     HOTEL SELECT
     ======================================================= */

  const selectHotel = (hotel) => {
    setSelectedHotel((current) =>
      current?.id === hotel.id
        ? null
        : hotel
    );
  };

  /* =======================================================
     GUIDE SELECT
     ======================================================= */

  const selectGuide = () => {
    setSelectedGuide((current) =>
      current ? null : demoGuide
    );
  };

  /* =======================================================
     SAVE TRIP
     ======================================================= */

  const createTrip = () => {
    const trip = {
      id: Date.now(),

      user_id: u?.id || null,

      fromLocation,
      destination,

      travellers,
      groupType,

      startDate,
      endDate,

      days,

      budget,

      interests: selectedInterests,

      transport: transport
        ? {
            id: transport.id,
            type: transport.type,
            name: transport.name,
            price: transport.price,
            duration: transport.duration,
          }
        : null,

      hotel: selectedHotel
        ? {
            id: selectedHotel.id,
            name: selectedHotel.name,
            price: selectedHotel.price,
            rooms: hotelRooms,
            nights: hotelNights,
            estimatedCost: hotelCost,
          }
        : null,

      guide:
        wantsGuide && selectedGuide
          ? {
              id: selectedGuide.id,
              name: selectedGuide.name,
              pricePerDay:
                selectedGuide.pricePerDay,
              days,
              estimatedCost: guideCost,
            }
          : null,

      estimatedTotal,

      createdAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "travelx_current_trip",
      JSON.stringify(trip)
    );

    /* Keep a list as well */
    const existingTrips =
      JSON.parse(
        localStorage.getItem(
          "travelx_trips"
        ) || "[]"
      );

    localStorage.setItem(
      "travelx_trips",
      JSON.stringify([
        ...existingTrips,
        trip,
      ])
    );

    setSavedTrip(true);
  };

  const hotelBookingLink = destination
    ? `https://www.google.com/search?q=${encodeURIComponent(
        `hotels in ${destination}`
      )}`
    : "https://www.google.com/search?q=hotels";

  const currentGroup = groupOptions.find(
    (item) => item.id === groupType
  );

  return (
    <section className="planner-page">

      {/* =================================================
          TOP BAR
          ================================================= */}

      <div className="planner-topbar">

        <button
          className="planner-back"
          onClick={() => nav("home")}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="planner-brand">
          TRAVEL<span>X</span>{" "}
          <b>AI</b>
        </div>

        <div className="planner-step-count">
          STEP {step} / 6
        </div>

      </div>

      {/* =================================================
          PROGRESS
          ================================================= */}

      <div className="planner-progress">

        {[
          "Trip",
          "Journey",
          "Travel",
          "Stay",
          "Guide",
          "Review",
        ].map((label, index) => {

          const number = index + 1;

          return (
            <div
              key={label}
              className={
                number <= step
                  ? "planner-progress-item active"
                  : "planner-progress-item"
              }
            >
              <span>{number}</span>
              <small>{label}</small>
            </div>
          );
        })}

      </div>

      {/* =================================================
          STEP 1 — TRAVELLERS
          ================================================= */}

      {step === 1 && (
        <div className="planner-step">

          <PlannerHero
            icon={<Users size={15} />}
            eyebrow="STEP 01 · YOUR TRIP"
            title={
              <>
                Let's build your
                <br />
                <em>perfect journey.</em>
              </>
            }
            description="Tell TRAVELX who is travelling and we'll shape the experience around you."
          />

          {/* MEMBERS */}

          <div className="planner-card">

            <div className="planner-card-heading">

              <div>
                <span>TRAVELLERS</span>
                <h2>
                  How many people are travelling?
                </h2>
              </div>

              <Users size={21} />

            </div>

            <div className="traveller-counter">

              <button
                onClick={() =>
                  setTravellers((value) =>
                    Math.max(
                      1,
                      value - 1
                    )
                  )
                }
                disabled={
                  travellers <= 1
                }
              >
                <Minus size={19} />
              </button>

              <div>
                <strong>
                  {travellers}
                </strong>

                <span>
                  {travellers === 1
                    ? "traveller"
                    : "travellers"}
                </span>
              </div>

              <button
                onClick={() =>
                  setTravellers((value) =>
                    Math.min(
                      30,
                      value + 1
                    )
                  )
                }
              >
                <Plus size={19} />
              </button>

            </div>

          </div>

          {/* GROUP */}

          <div className="planner-card">

            <div className="planner-card-heading">

              <div>
                <span>TRAVEL STYLE</span>

                <h2>
                  What's your travel group?
                </h2>
              </div>

            </div>

            <div className="group-grid">

              {groupOptions.map(
                (option) => {

                  const active =
                    groupType ===
                    option.id;

                  return (
                    <button
                      key={option.id}
                      className={
                        active
                          ? "group-option active"
                          : "group-option"
                      }
                      onClick={() =>
                        setGroupType(
                          option.id
                        )
                      }
                    >

                      <span className="group-emoji">
                        {option.icon}
                      </span>

                      <strong>
                        {option.label}
                      </strong>

                      <small>
                        {option.description}
                      </small>

                      {active && (
                        <span className="group-check">
                          <Check size={13} />
                        </span>
                      )}

                    </button>
                  );
                }
              )}

            </div>

          </div>

          <div className="planner-info-box">

            <Sparkles size={17} />

            <span>
              Your group type helps TRAVELX
              recommend suitable activities,
              restaurants and accommodation.
            </span>

          </div>

          <PlannerActions
            primary="Continue"
            onPrimary={nextStep}
          />

        </div>
      )}

      {/* =================================================
          STEP 2 — JOURNEY
          ================================================= */}

      {step === 2 && (
        <div className="planner-step">

          <PlannerHero
            icon={<MapPin size={15} />}
            eyebrow="STEP 02 · YOUR JOURNEY"
            title={
              <>
                Where are you
                <br />
                <em>going?</em>
              </>
            }
            description="Tell us where your journey starts and where you want to go."
          />

          {/* FROM */}

          <div className="planner-card">

            <div className="planner-card-heading">

              <div>
                <span>STARTING POINT</span>

                <h2>
                  Where are you starting from?
                </h2>
              </div>

              <Navigation size={20} />

            </div>

            <label className="planner-label">
              FROM
            </label>

            <div className="planner-input-wrap">

              <Navigation size={18} />

              <input
                value={fromLocation}
                onChange={(e) =>
                  setFromLocation(
                    e.target.value
                  )
                }
                placeholder="e.g. Hyderabad"
              />

              {fromLocation && (
                <Search size={16} />
              )}

            </div>

            {fromSuggestions.length >
              0 && (
                <div className="planner-suggestions">

                  {fromSuggestions.map(
                    (place) => (
                      <button
                        key={place}
                        onClick={() =>
                          setFromLocation(
                            place
                          )
                        }
                      >
                        <MapPin size={15} />
                        {place}
                      </button>
                    )
                  )}

                </div>
              )}

          </div>

          {/* DESTINATION + DATES */}

          <div className="planner-card">

            <div className="planner-card-heading">

              <div>
                <span>DESTINATION</span>

                <h2>
                  Choose your destination
                </h2>
              </div>

              <MapPin size={20} />

            </div>

            <label className="planner-label">
              TO
            </label>

            <div className="planner-input-wrap">

              <MapPin size={18} />

              <input
                value={destination}
                onChange={(e) =>
                  setDestination(
                    e.target.value
                  )
                }
                placeholder="Type a city or destination..."
              />

              {destination && (
                <Search size={16} />
              )}

            </div>

            {destinationSuggestions.length >
              0 && (
                <div className="planner-suggestions">

                  {destinationSuggestions.map(
                    (place) => (
                      <button
                        key={place}
                        onClick={() =>
                          setDestination(
                            place
                          )
                        }
                      >
                        <MapPin size={15} />
                        {place}
                      </button>
                    )
                  )}

                </div>
              )}

            <div className="date-grid">

              <label>

                <span>
                  <CalendarDays size={14} />
                  START DATE
                </span>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                />

              </label>

              <label>

                <span>
                  <CalendarDays size={14} />
                  END DATE
                </span>

                <input
                  type="date"
                  value={endDate}
                  min={
                    startDate ||
                    undefined
                  }
                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }
                />

              </label>

            </div>

            {startDate &&
              endDate && (
                <div className="date-summary">

                  <Clock3 size={15} />

                  <span>
                    {formatDate(
                      startDate
                    )}{" "}
                    →{" "}
                    {formatDate(
                      endDate
                    )}
                  </span>

                  <strong>
                    {days}{" "}
                    {days === 1
                      ? "day"
                      : "days"}
                  </strong>

                </div>
              )}

          </div>

          {/* INTERESTS */}

          <div className="planner-card">

            <div className="planner-card-heading">

              <div>
                <span>INTERESTS</span>

                <h2>
                  What would you like to experience?
                </h2>
              </div>

              <Sparkles size={20} />

            </div>

            <div className="interest-grid">

              {interests.map(
                (interest) => {

                  const active =
                    selectedInterests.includes(
                      interest
                    );

                  return (
                    <button
                      key={interest}
                      className={
                        active
                          ? "interest-option active"
                          : "interest-option"
                      }
                      onClick={() =>
                        toggleInterest(
                          interest
                        )
                      }
                    >

                      {active && (
                        <Check size={13} />
                      )}

                      {interest}

                    </button>
                  );
                }
              )}

            </div>

          </div>

          <PlannerActions
            onBack={previousStep}
            onPrimary={nextStep}
            primary="Continue"
            disabled={
              !fromLocation ||
              !destination ||
              !startDate ||
              !endDate
            }
          />

        </div>
      )}

      {/* =================================================
          STEP 3 — TRANSPORT
          ================================================= */}

      {step === 3 && (
        <div className="planner-step">

          <PlannerHero
            icon={<Navigation size={15} />}
            eyebrow="STEP 03 · YOUR JOURNEY"
            title={
              <>
                Choose how you
                <br />
                <em>want to travel.</em>
              </>
            }
            description={
              <>
                Select your preferred transport from{" "}
                <strong>
                  {fromLocation}
                </strong>{" "}
                to{" "}
                <strong>
                  {destination}
                </strong>
                .
              </>
            }
          />

          <div className="transport-route">

            <div>
              <small>FROM</small>
              <strong>
                {fromLocation}
              </strong>
            </div>

            <ArrowRight size={20} />

            <div>
              <small>TO</small>
              <strong>
                {destination}
              </strong>
            </div>

          </div>

          <div className="transport-grid">

            {transportOptions.map(
              (option) => {

                const selected =
                  transport?.id ===
                  option.id;

                const Icon =
                  option.icon;

                const bookingLink =
                  `https://www.google.com/search?q=${encodeURIComponent(
                    option.bookingQuery
                  )}`;

                return (
                  <article
                    key={option.id}
                    className={
                      selected
                        ? "transport-card selected"
                        : "transport-card"
                    }
                  >

                    <div className="transport-icon">
                      <Icon size={25} />
                    </div>

                    <div className="transport-content">

                      <span className="transport-type">
                        {option.type}
                      </span>

                      <h3>
                        {option.name}
                      </h3>

                      <p>
                        {option.description}
                      </p>

                      <div className="transport-meta">

                        <span>
                          <Clock3 size={13} />
                          {option.duration}
                        </span>

                        <strong>
                          {option.price ===
                          0
                            ? "Own cost"
                            : formatMoney(
                                option.price
                              )}
                        </strong>

                      </div>

                      <div className="transport-actions">

                        <button
                          className={
                            selected
                              ? "transport-select selected"
                              : "transport-select"
                          }
                          onClick={() =>
                            setTransport(
                              selected
                                ? null
                                : option
                            )
                          }
                        >
                          {selected ? (
                            <>
                              <Check size={15} />
                              Selected
                            </>
                          ) : (
                            "Select"
                          )}
                        </button>

                        <a
                          href={
                            bookingLink
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="transport-link"
                        >
                          Booking
                          <ExternalLink
                            size={13}
                          />
                        </a>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

          <div className="planner-info-box">

            <ShieldCheck size={17} />

            <span>
              Transport is optional.
              TRAVELX never automatically
              books or charges you.
            </span>

          </div>

          <PlannerActions
            onBack={previousStep}
            onPrimary={nextStep}
            primary="Continue"
          />

        </div>
      )}

      {/* =================================================
          STEP 4 — HOTEL + BUDGET
          ================================================= */}

      {step === 4 && (
        <div className="planner-step">

          <PlannerHero
            icon={<Hotel size={15} />}
            eyebrow="STEP 04 · YOUR STAY"
            title={
              <>
                Choose your
                <br />
                <em>home base.</em>
              </>
            }
            description="Your hotel is optional. Choose it only if you want to stay at the TRAVELX recommendation."
          />

          {/* BUDGET */}

          <div className="planner-card">

            <div className="planner-card-heading">

              <div>
                <span>YOUR BUDGET</span>

                <h2>
                  What's your total trip budget?
                </h2>
              </div>

              <Wallet size={20} />

            </div>

            <label className="planner-label">
              TOTAL BUDGET
            </label>

            <div className="budget-input">

              <span>₹</span>

              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) =>
                  setBudget(
                    e.target.value
                  )
                }
                placeholder="Enter your budget"
              />

            </div>

            <div className="budget-suggestions">

              {[5000, 10000, 20000, 30000].map(
                (amount) => (
                  <button
                    key={amount}
                    onClick={() =>
                      setBudget(
                        String(amount)
                      )
                    }
                  >
                    {formatMoney(amount)}
                  </button>
                )
              )}

            </div>

          </div>

          {/* HOTEL */}

          <div className="planner-section-title">

            <span>
              OPTIONAL ACCOMMODATION
            </span>

            <h2>
              Stay somewhere you{" "}
              <em>like.</em>
            </h2>

            <p>
              TRAVELX recommends a demo stay
              based on your trip. Nothing is
              booked unless you select it.
            </p>

          </div>

          {demoHotels.map(
            (hotel) => {

              const selected =
                selectedHotel?.id ===
                hotel.id;

              const estimated =
                hotel.price *
                hotelRooms *
                hotelNights;

              return (
                <article
                  key={hotel.id}
                  className={
                    selected
                      ? "hotel-card selected"
                      : "hotel-card"
                  }
                >

                  <div className="hotel-icon">
                    <Hotel size={25} />
                  </div>

                  <div className="hotel-content">

                    <div className="hotel-topline">

                      <span>
                        TRAVELX RECOMMENDATION
                      </span>

                      {selected && (
                        <div className="hotel-selected">
                          <Check size={13} />
                          Selected
                        </div>
                      )}

                    </div>

                    <h3>
                      {hotel.name}
                    </h3>

                    <div className="hotel-location">

                      <MapPin size={14} />

                      {destination} ·{" "}
                      {hotel.distance}

                    </div>

                    <p>
                      {hotel.description}
                    </p>

                    <div className="hotel-meta">

                      <span>
                        <Star
                          size={14}
                          fill="currentColor"
                        />
                        {hotel.rating}
                      </span>

                      <span>
                        <Users size={14} />
                        Up to 4 / room
                      </span>

                      <span>
                        <Wallet size={14} />
                        {formatMoney(
                          hotel.price
                        )}
                        /night
                      </span>

                    </div>

                    <div className="hotel-calculation">

                      <strong>
                        {formatMoney(
                          estimated
                        )}
                      </strong>

                      <span>
                        {hotelRooms}{" "}
                        {hotelRooms === 1
                          ? "room"
                          : "rooms"}{" "}
                        ×{" "}
                        {hotelNights}{" "}
                        {hotelNights ===
                        1
                          ? "night"
                          : "nights"}
                      </span>

                    </div>

                    <div className="hotel-actions">

                      <button
                        className={
                          selected
                            ? "hotel-select selected"
                            : "hotel-select"
                        }
                        onClick={() =>
                          selectHotel(
                            hotel
                          )
                        }
                      >
                        {selected ? (
                          <>
                            <Check size={16} />
                            Hotel Selected
                          </>
                        ) : (
                          <>
                            Select Hotel
                            <ArrowRight
                              size={16}
                            />
                          </>
                        )}
                      </button>

                      <a
                        href={
                          hotelBookingLink
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="hotel-booking"
                      >
                        View Booking
                        <ExternalLink
                          size={14}
                        />
                      </a>

                    </div>

                  </div>

                </article>
              );
            }
          )}

          {!selectedHotel && (
            <div className="no-hotel-box">

              <Hotel size={18} />

              <div>

                <strong>
                  Staying somewhere else?
                </strong>

                <span>
                  That's completely fine.
                  You can skip the TRAVELX
                  hotel and stay wherever
                  you prefer.
                </span>

              </div>

            </div>
          )}

          <PlannerActions
            onBack={previousStep}
            onPrimary={nextStep}
            primary="Continue"
          />

        </div>
      )}

      {/* =================================================
          STEP 5 — GUIDE
          ================================================= */}

      {step === 5 && (
        <div className="planner-step">

          <PlannerHero
            icon={<UserRound size={15} />}
            eyebrow="STEP 05 · LOCAL GUIDE"
            title={
              <>
                Want someone who
                <br />
                <em>knows the place?</em>
              </>
            }
            description="Add an optional local guide to your journey."
          />

          <div className="guide-choice-grid">

            <button
              className={
                !wantsGuide
                  ? "guide-choice active"
                  : "guide-choice"
              }
              onClick={() => {
                setWantsGuide(false);
                setSelectedGuide(null);
              }}
            >

              <span>🚶</span>

              <strong>
                No guide
              </strong>

              <small>
                Explore independently
              </small>

              {!wantsGuide && (
                <Check size={16} />
              )}

            </button>

            <button
              className={
                wantsGuide
                  ? "guide-choice active"
                  : "guide-choice"
              }
              onClick={() =>
                setWantsGuide(true)
              }
            >

              <span>🧭</span>

              <strong>
                Yes, find a guide
              </strong>

              <small>
                Local guidance · ₹300/day
              </small>

              {wantsGuide && (
                <Check size={16} />
              )}

            </button>

          </div>

          {wantsGuide && (
            <article
              className={
                selectedGuide
                  ? "planner-guide-card selected"
                  : "planner-guide-card"
              }
            >

              <div className="planner-guide-avatar">
                {demoGuide.initials}
              </div>

              <div className="planner-guide-info">

                <span>
                  VERIFIED TRAVELX GUIDE
                </span>

                <h3>
                  {demoGuide.name}
                </h3>

                <p>
                  {demoGuide.specialty}
                </p>

                <div className="guide-rating-line">
                  <Star
                    size={14}
                    fill="currentColor"
                  />
                  {demoGuide.rating} ·{" "}
                  {demoGuide.reviews} reviews
                </div>

                <div>
                  {demoGuide.languages.join(
                    " · "
                  )}
                </div>

                <small>
                  {demoGuide.experience}{" "}
                  experience
                </small>

              </div>

              <div className="planner-guide-price">

                <strong>
                  ₹
                  {demoGuide.pricePerDay}
                </strong>

                <span>
                  /day
                </span>

                <small>
                  Estimated{" "}
                  {formatMoney(
                    guideCost
                  )}{" "}
                  for {days} days
                </small>

                <button
                  onClick={selectGuide}
                >
                  {selectedGuide
                    ? "Guide Selected"
                    : "Select Guide"}
                </button>

              </div>

            </article>
          )}

          <div className="planner-info-box">

            <ShieldCheck size={17} />

            <span>
              Guide contact details remain
              private. A phone number is not
              revealed before booking.
            </span>

          </div>

          <PlannerActions
            onBack={previousStep}
            onPrimary={nextStep}
            primary="Review Trip"
          />

        </div>
      )}

      {/* =================================================
          STEP 6 — REVIEW
          ================================================= */}

      {step === 6 && (
        <div className="planner-step">

          <PlannerHero
            icon={<Check size={15} />}
            eyebrow="STEP 06 · READY TO TRAVEL"
            title={
              <>
                Your trip is
                <br />
                <em>ready to go.</em>
              </>
            }
            description="Review everything before saving your journey."
          />

          {/* ROUTE */}

          <div className="review-route-card">

            <div>

              <span>
                FROM
              </span>

              <h3>
                {fromLocation}
              </h3>

            </div>

            <ArrowRight size={22} />

            <div>

              <span>
                DESTINATION
              </span>

              <h3>
                {destination}
              </h3>

            </div>

          </div>

          {/* BASIC SUMMARY */}

          <div className="trip-review-card">

            <div className="review-grid">

              <ReviewItem
                label="Travellers"
                value={`${travellers} ${
                  travellers === 1
                    ? "traveller"
                    : "travellers"
                }`}
                icon={
                  <Users size={17} />
                }
              />

              <ReviewItem
                label="Travel style"
                value={
                  currentGroup?.label ||
                  "Travel"
                }
                icon={
                  <UserRound size={17} />
                }
              />

              <ReviewItem
                label="Dates"
                value={`${formatDate(
                  startDate
                )} → ${formatDate(
                  endDate
                )}`}
                icon={
                  <CalendarDays
                    size={17}
                  />
                }
              />

              <ReviewItem
                label="Duration"
                value={`${days} ${
                  days === 1
                    ? "day"
                    : "days"
                }`}
                icon={
                  <Clock3 size={17} />
                }
              />

              <ReviewItem
                label="Budget"
                value={
                  budget
                    ? formatMoney(
                        budget
                      )
                    : "Not specified"
                }
                icon={
                  <Wallet size={17} />
                }
              />

              <ReviewItem
                label="Transport"
                value={
                  transport
                    ? transport.type
                    : "Not selected"
                }
                icon={
                  <Navigation
                    size={17}
                  />
                }
              />

            </div>

            <div className="review-interests">

              <span>
                INTERESTS
              </span>

              <div>

                {selectedInterests.length >
                0 ? (
                  selectedInterests.map(
                    (interest) => (
                      <small
                        key={interest}
                      >
                        {interest}
                      </small>
                    )
                  )
                ) : (
                  <small>
                    General discovery
                  </small>
                )}

              </div>

            </div>

          </div>

          {/* TRANSPORT SUMMARY */}

          <div className="review-hotel-card">

            <Navigation size={21} />

            <div>

              <span>
                JOURNEY
              </span>

              <h3>
                {transport
                  ? transport.name
                  : "No transport selected"}
              </h3>

              <p>
                {transport
                  ? `${transport.type} · ${
                      transport.duration
                    } · ${
                      transport.price ===
                      0
                        ? "Own vehicle"
                        : formatMoney(
                            transport.price
                          )
                    }`
                  : "You can arrange your own transport."}
              </p>

            </div>

          </div>

          {/* HOTEL SUMMARY */}

          <div className="review-hotel-card">

            <Hotel size={21} />

            <div>

              <span>
                ACCOMMODATION
              </span>

              {selectedHotel ? (
                <>
                  <h3>
                    {selectedHotel.name}
                  </h3>

                  <p>
                    {hotelRooms}{" "}
                    {hotelRooms === 1
                      ? "room"
                      : "rooms"}{" "}
                    · {hotelNights}{" "}
                    {hotelNights === 1
                      ? "night"
                      : "nights"}{" "}
                    · Estimated{" "}
                    {formatMoney(
                      hotelCost
                    )}
                  </p>
                </>
              ) : (
                <>
                  <h3>
                    No TRAVELX hotel selected
                  </h3>

                  <p>
                    You are free to stay
                    anywhere you prefer.
                  </p>
                </>
              )}

            </div>

          </div>

          {/* GUIDE SUMMARY */}

          <div className="review-hotel-card">

            <UserRound size={21} />

            <div>

              <span>
                LOCAL GUIDE
              </span>

              {selectedGuide ? (
                <>
                  <h3>
                    {selectedGuide.name}
                  </h3>

                  <p>
                    ₹
                    {
                      selectedGuide
                        .pricePerDay
                    }
                    /day · {days} days ·
                    Estimated{" "}
                    {formatMoney(
                      guideCost
                    )}
                  </p>
                </>
              ) : (
                <>
                  <h3>
                    No guide selected
                  </h3>

                  <p>
                    You will explore
                    independently.
                  </p>
                </>
              )}

            </div>

          </div>

          {/* ESTIMATE */}

          <div className="trip-total-card">

            <div>

              <span>
                ESTIMATED TRIP ALLOCATION
              </span>

              <strong>
                {formatMoney(
                  estimatedTotal
                )}
              </strong>

            </div>

            <div className="trip-cost-breakdown">

              <span>
                Transport{" "}
                <b>
                  {formatMoney(
                    transportCost
                  )}
                </b>
              </span>

              <span>
                Hotel{" "}
                <b>
                  {formatMoney(
                    hotelCost
                  )}
                </b>
              </span>

              <span>
                Guide{" "}
                <b>
                  {formatMoney(
                    guideCost
                  )}
                </b>
              </span>

              <span>
                Activities{" "}
                <b>
                  {formatMoney(
                    activityAllocation
                  )}
                </b>
              </span>

            </div>

            <small>
              This is an estimate, not a
              booking charge.
            </small>

          </div>

          {!savedTrip ? (
            <button
              className="planner-save-button"
              onClick={createTrip}
            >
              <Check size={19} />
              Save My Trip
              <ArrowRight size={18} />
            </button>
          ) : (
            <div className="trip-saved-success">

              <Check size={22} />

              <div>

                <strong>
                  Trip saved successfully!
                </strong>

                <span>
                  Your complete itinerary
                  will be available in
                  Trips.
                </span>

              </div>

            </div>
          )}

          <div className="planner-final-actions">

            <button
              className="planner-secondary"
              onClick={previousStep}
            >
              <ArrowLeft size={17} />
              Edit Trip
            </button>

            {savedTrip && (
              <button
                className="planner-primary"
                onClick={() =>
                  nav("trips")
                }
              >
                Go to Trips
                <ArrowRight size={18} />
              </button>
            )}

          </div>

        </div>
      )}

    </section>
  );
}

/* =========================================================
   HERO
   ========================================================= */

function PlannerHero({
  icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="planner-hero">

      <div className="planner-eyebrow">
        {icon}
        {eyebrow}
      </div>

      <h1>
        {title}
      </h1>

      <p>
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   ACTIONS
   ========================================================= */

function PlannerActions({
  onBack,
  onPrimary,
  primary,
  disabled = false,
}) {
  return (
    <div className="planner-actions">

      {onBack && (
        <button
          className="planner-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back
        </button>
      )}

      <button
        className="planner-primary"
        onClick={onPrimary}
        disabled={disabled}
      >
        {primary}
        <ArrowRight size={18} />
      </button>

    </div>
  );
}

/* =========================================================
   REVIEW ITEM
   ========================================================= */

function ReviewItem({
  label,
  value,
  icon,
}) {
  return (
    <div className="review-item">

      <div className="review-item-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}

export default Planner;