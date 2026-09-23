import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  CloudRain,
  CloudSun,
  Coffee,
  Edit3,
  ExternalLink,
  Hotel,
  MapPin,
  MessageCircle,
  Minus,
  Navigation,
  Plus,
  Save,
  Send,
  ShoppingBag,
  Sparkles,
  Sun,
  Trash2,
  Utensils,
  Wallet,
  X,
} from "lucide-react";

/* =========================================================
   HELPERS
   ========================================================= */

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function parseDate(value) {
  if (!value) return null;
  return new Date(`${value}T00:00:00`);
}

function formatDate(value) {
  const date = parseDate(value);

  if (!date) return "";

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(value) {
  const date = parseDate(value);

  if (!date) return "";

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function getTripDays(startDate, endDate) {
  if (!startDate || !endDate) return 1;

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const diff = Math.round(
    (end - start) / (1000 * 60 * 60 * 24)
  );

  return Math.max(1, diff + 1);
}

function addDays(dateString, amount) {
  const date = parseDate(dateString);

  if (!date) return "";

  date.setDate(date.getDate() + amount);

  return date.toISOString().split("T")[0];
}

function makeId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/* =========================================================
   ACTIVITY TYPES
   ========================================================= */

const activityTypes = [
  {
    id: "food",
    label: "Food",
    icon: Utensils,
  },
  {
    id: "place",
    label: "Place",
    icon: MapPin,
  },
  {
    id: "travel",
    label: "Travel",
    icon: Navigation,
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
  },
  {
    id: "hotel",
    label: "Hotel",
    icon: Hotel,
  },
  {
    id: "free",
    label: "Free choice",
    icon: Sparkles,
  },
];

/* =========================================================
   DEFAULT PLACE DATABASE
   ========================================================= */

const destinationPlans = {
  Hyderabad: {
    places: [
      {
        title: "Breakfast / Tiffin",
        type: "food",
        time: "08:00",
        estimated: 250,
        description:
          "Start the day with a local breakfast.",
      },
      {
        title: "Golconda Fort",
        type: "place",
        time: "09:30",
        estimated: 300,
        description:
          "Explore the historic fort and surrounding area.",
        outdoor: true,
      },
      {
        title: "Lunch",
        type: "food",
        time: "13:00",
        estimated: 500,
        description:
          "Lunch at a local restaurant.",
      },
      {
        title: "Travel to Charminar",
        type: "travel",
        time: "14:30",
        estimated: 200,
        description:
          "Travel from the previous location.",
      },
      {
        title: "Charminar",
        type: "place",
        time: "15:00",
        estimated: 200,
        description:
          "Visit one of Hyderabad's famous landmarks.",
        outdoor: true,
      },
      {
        title: "Local Biryani",
        type: "food",
        time: "18:30",
        estimated: 700,
        description:
          "Try a local biryani dinner.",
      },
      {
        title: "Return to Hotel",
        type: "hotel",
        time: "20:30",
        estimated: 0,
        description:
          "Return to your selected hotel.",
      },
    ],
  },

  Vijayawada: {
    places: [
      {
        title: "Breakfast / Tiffin",
        type: "food",
        time: "08:00",
        estimated: 250,
        description:
          "Start the day with a local breakfast.",
      },
      {
        title: "Kanaka Durga Temple",
        type: "place",
        time: "09:30",
        estimated: 150,
        description:
          "Visit the famous temple and surrounding area.",
        outdoor: true,
      },
      {
        title: "Lunch",
        type: "food",
        time: "13:00",
        estimated: 500,
        description:
          "Lunch at a local restaurant.",
      },
      {
        title: "Prakasam Barrage",
        type: "place",
        time: "15:00",
        estimated: 100,
        description:
          "Enjoy the riverfront and scenic views.",
        outdoor: true,
      },
      {
        title: "Shopping / Free Choice",
        type: "shopping",
        time: "17:00",
        estimated: 1000,
        description:
          "Use this time for shopping or your own choice.",
      },
      {
        title: "Dinner",
        type: "food",
        time: "19:30",
        estimated: 500,
        description:
          "Dinner before returning to your stay.",
      },
      {
        title: "Return to Hotel",
        type: "hotel",
        time: "21:00",
        estimated: 0,
        description:
          "Return to your selected hotel.",
      },
    ],
  },
};

/* =========================================================
   GENERIC DESTINATION PLAN
   ========================================================= */

function genericDayPlan(destination) {
  return [
    {
      title: "Breakfast / Tiffin",
      type: "food",
      time: "08:00",
      estimated: 250,
      description:
        "Start the day with breakfast near your stay.",
    },
    {
      title: `Explore ${destination}`,
      type: "place",
      time: "09:30",
      estimated: 300,
      description:
        `Explore a recommended attraction in ${destination}.`,
      outdoor: true,
    },
    {
      title: "Lunch",
      type: "food",
      time: "13:00",
      estimated: 500,
      description:
        "Lunch at a local restaurant.",
    },
    {
      title: "Travel to next location",
      type: "travel",
      time: "14:30",
      estimated: 200,
      description:
        "Travel between planned locations.",
    },
    {
      title: "Local Attraction",
      type: "place",
      time: "15:30",
      estimated: 300,
      description:
        "Visit another local attraction.",
      outdoor: true,
    },
    {
      title: "Shopping / Free Choice",
      type: "shopping",
      time: "17:30",
      estimated: 1000,
      description:
        "Shopping, café time or your own activity.",
    },
    {
      title: "Dinner",
      type: "food",
      time: "20:00",
      estimated: 500,
      description:
        "Dinner before returning to your stay.",
    },
    {
      title: "Return to Hotel",
      type: "hotel",
      time: "21:30",
      estimated: 0,
      description:
        "Return to your hotel or chosen stay.",
    },
  ];
}

/* =========================================================
   CREATE ITINERARY
   ========================================================= */

function createInitialItinerary(trip) {
  const days = getTripDays(
    trip.startDate,
    trip.endDate
  );

  const destination =
    trip.destination || "Destination";

  const predefined =
    destinationPlans[destination]?.places;

  const normalPlan =
    predefined || genericDayPlan(destination);

  const result = [];

  for (let index = 0; index < days; index++) {
    const date = addDays(
      trip.startDate,
      index
    );

    let activities = normalPlan.map(
      (activity) => ({
        id: makeId(),
        ...activity,
        actual: null,
        completed: false,
        weatherAffected: false,
      })
    );

    /*
     * FIRST DAY:
     * Journey starts from the actual start date.
     */

    if (index === 0) {
      activities = [
        {
          id: makeId(),
          title: `Journey from ${
            trip.fromLocation || "your location"
          }`,
          type: "travel",
          time: "06:00",
          estimated:
            trip.transport?.price || 0,
          description:
            `Start your journey from ${
              trip.fromLocation ||
              "your starting location"
            } towards ${destination}.`,
          actual: null,
          completed: false,
          outdoor: false,
          weatherAffected: false,
        },

        ...activities,
      ];
    }

    /*
     * LAST DAY:
     * Return journey is included on the actual
     * ending date.
     */

    if (index === days - 1) {
      activities.push({
        id: makeId(),
        title: `Return to ${
          trip.fromLocation ||
          "starting location"
        }`,
        type: "travel",
        time: "18:00",
        estimated:
          trip.transport?.price || 0,
        description:
          `Complete your journey from ${destination} back to ${
            trip.fromLocation ||
            "your starting location"
          }.`,
        actual: null,
        completed: false,
        outdoor: false,
        weatherAffected: false,
      });
    }

    /*
     * HOTEL COST:
     * Hotel nights are attached to nights after
     * each day except the final day.
     */

    if (
      trip.hotel &&
      index < days - 1
    ) {
      const hotelActivity = {
        id: makeId(),
        title: `Stay at ${trip.hotel.name}`,
        type: "hotel",
        time: "21:30",
        estimated:
          trip.hotel.price ||
          0,
        description:
          "Accommodation for this night.",
        actual: null,
        completed: false,
        outdoor: false,
        weatherAffected: false,
      };

      activities.push(hotelActivity);
    }

    result.push({
      id: `day-${index + 1}`,
      dayNumber: index + 1,
      date,
      completed: false,
      weather: null,
      activities,
    });
  }

  return result;
}

/* =========================================================
   WEATHER
   ========================================================= */

/*
 * This is deliberately separated from the UI.

 * If you have a weather API later, replace this function
 * with your API call.

 * Without an API key/service, the app must NOT pretend
 * that live weather was detected.
 */

async function getWeather(destination, date) {
  try {
    /*
     * Open-Meteo can be connected here once you add
     * geocoding + weather fetching.

     * Returning null means:
     * "weather not available"
     */
    return null;
  } catch {
    return null;
  }
}

/* =========================================================
   WEATHER ALTERNATIVE
   ========================================================= */

function weatherAlternative(activity) {
  if (
    activity.type === "place" &&
    activity.outdoor
  ) {
    return {
      title: "Indoor alternative",
      description:
        "Weather may affect this outdoor activity. Consider a museum, café, shopping area or indoor attraction instead.",
    };
  }

  if (activity.type === "shopping") {
    return {
      title: "Weather-safe option",
      description:
        "Keep this shopping/free-choice block because it can easily replace an outdoor activity.",
    };
  }

  return null;
}

/* =========================================================
   MAIN
   ========================================================= */

function Trips({ nav, u }) {
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);

  const [expandedDay, setExpandedDay] =
    useState(1);

  const [showChat, setShowChat] =
    useState(false);

  const [chatInput, setChatInput] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        id: makeId(),
        role: "assistant",
        text:
          "Hi! I can change your itinerary, add shopping, adjust activities or help keep the trip within budget.",
      },
    ]);

  const [editingActivity, setEditingActivity] =
    useState(null);

  const [activityForm, setActivityForm] =
    useState({
      title: "",
      type: "free",
      time: "10:00",
      estimated: "",
      description: "",
    });

  const [addingToDay, setAddingToDay] =
    useState(null);

  const [weatherLoading, setWeatherLoading] =
    useState(false);

  const [completedTrip, setCompletedTrip] =
    useState(false);

  /* =======================================================
     LOAD TRIP
     ======================================================= */

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "travelx_current_trip"
      );

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      setTrip(parsed);

      const savedItinerary =
        localStorage.getItem(
          `travelx_itinerary_${parsed.id}`
        );

      if (savedItinerary) {
        setItinerary(
          JSON.parse(savedItinerary)
        );
      } else {
        const generated =
          createInitialItinerary(
            parsed
          );

        setItinerary(generated);

        localStorage.setItem(
          `travelx_itinerary_${parsed.id}`,
          JSON.stringify(generated)
        );
      }

      const savedCompleted =
        localStorage.getItem(
          `travelx_completed_trip_${parsed.id}`
        );

      setCompletedTrip(
        savedCompleted === "true"
      );
    } catch {
      console.error(
        "Unable to load trip."
      );
    }
  }, []);

  /* =======================================================
     SAVE ITINERARY
     ======================================================= */

  useEffect(() => {
    if (!trip || itinerary.length === 0)
      return;

    localStorage.setItem(
      `travelx_itinerary_${trip.id}`,
      JSON.stringify(itinerary)
    );
  }, [trip, itinerary]);

  /* =======================================================
     CALCULATIONS
     ======================================================= */

  const totalBudget =
    Number(trip?.budget || 0);

  const allActivities = useMemo(
    () =>
      itinerary.flatMap(
        (day) => day.activities
      ),
    [itinerary]
  );

  const completedActivities =
    allActivities.filter(
      (activity) =>
        activity.completed
    );

  const spent = allActivities.reduce(
    (sum, activity) => {
      if (
        activity.actual !== null &&
        activity.actual !== ""
      ) {
        return (
          sum + Number(activity.actual || 0)
        );
      }

      return sum;
    },
    0
  );

  const estimatedTotal =
    allActivities.reduce(
      (sum, activity) =>
        sum +
        Number(
          activity.estimated || 0
        ),
      0
    );

  const remaining =
    totalBudget - spent;

  const percentage =
    totalBudget > 0
      ? Math.min(
          100,
          Math.round(
            (spent / totalBudget) * 100
          )
        )
      : 0;

  const completedDays =
    itinerary.filter(
      (day) => day.completed
    ).length;

  const tripDays =
    itinerary.length;

  const dailyBudget =
    tripDays > 0
      ? Math.round(
          totalBudget / tripDays
        )
      : totalBudget;

  /* =======================================================
     DAY SPENDING
     ======================================================= */

  function getDaySpent(day) {
    return day.activities.reduce(
      (sum, activity) => {
        if (
          activity.actual !== null &&
          activity.actual !== ""
        ) {
          return (
            sum +
            Number(activity.actual || 0)
          );
        }

        return sum;
      },
      0
    );
  }

  function getDayEstimated(day) {
    return day.activities.reduce(
      (sum, activity) =>
        sum +
        Number(
          activity.estimated || 0
        ),
      0
    );
  }

  function getDayRemaining(day) {
    /*
     * Daily budget is calculated against the
     * total trip budget, then actual spending
     * is carried into the overall remaining
     * balance.
     */
    return dailyBudget - getDaySpent(day);
  }

  /* =======================================================
     UPDATE ACTUAL SPENDING
     * ======================================================= */

  function updateActual(
    dayId,
    activityId,
    value
  ) {
    setItinerary((current) =>
      current.map((day) => {
        if (day.id !== dayId)
          return day;

        return {
          ...day,
          activities:
            day.activities.map(
              (activity) =>
                activity.id ===
                activityId
                  ? {
                      ...activity,
                      actual:
                        value === ""
                          ? null
                          : Number(value),
                    }
                  : activity
            ),
        };
      })
    );
  }

  /* =======================================================
     TOGGLE ACTIVITY
     ======================================================= */

  function toggleActivity(
    dayId,
    activityId
  ) {
    setItinerary((current) =>
      current.map((day) => {
        if (day.id !== dayId)
          return day;

        return {
          ...day,
          activities:
            day.activities.map(
              (activity) =>
                activity.id ===
                activityId
                  ? {
                      ...activity,
                      completed:
                        !activity.completed,
                    }
                  : activity
            ),
        };
      })
    );
  }

  /* =======================================================
     COMPLETE DAY
     ======================================================= */

  function completeDay(dayId) {
    setItinerary((current) =>
      current.map((day) =>
        day.id === dayId
          ? {
              ...day,
              completed: !day.completed,
              activities:
                !day.completed
                  ? day.activities.map(
                      (activity) => ({
                        ...activity,
                        completed: true,
                      })
                    )
                  : day.activities,
            }
          : day
      )
    );
  }

  /* =======================================================
     WEATHER
     ======================================================= */

  async function checkWeather(day) {
    if (!trip) return;

    setWeatherLoading(true);

    const weather =
      await getWeather(
        trip.destination,
        day.date
      );

    setWeatherLoading(false);

    if (!weather) {
      alert(
        "Live weather is not connected yet. Add your weather API to get real-time weather detection."
      );
      return;
    }

    setItinerary((current) =>
      current.map((item) =>
        item.id === day.id
          ? {
              ...item,
              weather,
              activities:
                weather.bad
                  ? item.activities.map(
                      (activity) =>
                        activity.outdoor
                          ? {
                              ...activity,
                              weatherAffected:
                                true,
                            }
                          : activity
                    )
                  : item.activities,
            }
          : item
      )
    );
  }

  /* =======================================================
     ADD ACTIVITY
     ======================================================= */

  function openAddActivity(dayId) {
    setAddingToDay(dayId);

    setActivityForm({
      title: "",
      type: "free",
      time: "10:00",
      estimated: "",
      description: "",
    });
  }

  function saveNewActivity() {
    if (
      !addingToDay ||
      !activityForm.title.trim()
    ) {
      return;
    }

    const newActivity = {
      id: makeId(),
      title:
        activityForm.title.trim(),
      type: activityForm.type,
      time: activityForm.time,
      estimated:
        Number(
          activityForm.estimated || 0
        ),
      actual: null,
      completed: false,
      description:
        activityForm.description ||
        "Added by you.",
      outdoor:
        activityForm.type === "place",
      weatherAffected: false,
    };

    setItinerary((current) =>
      current.map((day) =>
        day.id === addingToDay
          ? {
              ...day,
              activities: [
                ...day.activities,
                newActivity,
              ],
            }
          : day
      )
    );

    setAddingToDay(null);
  }

  /* =======================================================
     EDIT ACTIVITY
     ======================================================= */

  function openEditActivity(
    dayId,
    activity
  ) {
    setEditingActivity({
      dayId,
      activityId: activity.id,
    });

    setActivityForm({
      title: activity.title,
      type: activity.type,
      time: activity.time,
      estimated:
        activity.estimated || "",
      description:
        activity.description || "",
    });
  }

  function saveEditedActivity() {
    if (!editingActivity) return;

    setItinerary((current) =>
      current.map((day) => {
        if (
          day.id !==
          editingActivity.dayId
        ) {
          return day;
        }

        return {
          ...day,
          activities:
            day.activities.map(
              (activity) =>
                activity.id ===
                editingActivity.activityId
                  ? {
                      ...activity,
                      title:
                        activityForm.title,
                      type:
                        activityForm.type,
                      time:
                        activityForm.time,
                      estimated:
                        Number(
                          activityForm.estimated ||
                            0
                        ),
                      description:
                        activityForm.description,
                    }
                  : activity
            ),
        };
      })
    );

    setEditingActivity(null);
  }

  /* =======================================================
     DELETE
     ======================================================= */

  function deleteActivity(
    dayId,
    activityId
  ) {
    setItinerary((current) =>
      current.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities:
                day.activities.filter(
                  (activity) =>
                    activity.id !==
                    activityId
                ),
            }
          : day
      )
    );
  }

  /* =======================================================
     CHAT
     ======================================================= */

  function addMessage(role, text) {
    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role,
        text,
      },
    ]);
  }

  function processChat(command) {
    const text =
      command.toLowerCase().trim();

    if (!text) return;

    addMessage("user", command);

    /*
     * ADD SHOPPING
     */

    if (
      text.includes("shopping") &&
      (text.includes("add") ||
        text.includes("include"))
    ) {
      const targetDay =
        itinerary.find(
          (day) => !day.completed
        ) || itinerary[0];

      if (targetDay) {
        const amountMatch =
          command.match(
            /₹?\s?([\d,]+)/
          );

        const amount = amountMatch
          ? Number(
              amountMatch[1].replace(
                /,/g,
                ""
              )
            )
          : 1000;

        const activity = {
          id: makeId(),
          title:
            "Shopping / Personal Choice",
          type: "shopping",
          time: "17:00",
          estimated: amount,
          actual: null,
          completed: false,
          outdoor: false,
          weatherAffected: false,
          description:
            "Shopping budget added by you.",
        };

        setItinerary((current) =>
          current.map((day) =>
            day.id === targetDay.id
              ? {
                  ...day,
                  activities: [
                    ...day.activities,
                    activity,
                  ],
                }
              : day
          )
        );

        addMessage(
          "assistant",
          `Added a shopping/free-choice block of ${formatMoney(
            amount
          )} to Day ${
            targetDay.dayNumber
          }.`
        );

        return;
      }
    }

    /*
     * REMOVE ACTIVITY
     */

    if (
      text.includes("remove") ||
      text.includes("delete")
    ) {
      const matched =
        allActivities.find(
          (activity) =>
            text.includes(
              activity.title
                .toLowerCase()
                .replace(
                  /\/|-/g,
                  " "
                )
            ) ||
            activity.title
              .toLowerCase()
              .split(" ")
              .some(
                (word) =>
                  word.length > 4 &&
                  text.includes(word)
              )
        );

      if (matched) {
        setItinerary((current) =>
          current.map((day) => ({
            ...day,
            activities:
              day.activities.filter(
                (activity) =>
                  activity.id !==
                  matched.id
              ),
          }))
        );

        addMessage(
          "assistant",
          `Removed "${matched.title}" from your itinerary.`
        );

        return;
      }
    }

    /*
     * CHEAPER PLAN
     */

    if (
      text.includes("cheaper") ||
      text.includes("save money") ||
      text.includes("reduce budget")
    ) {
      setItinerary((current) =>
        current.map((day) => ({
          ...day,
          activities:
            day.activities.map(
              (activity) =>
                activity.type ===
                  "shopping" ||
                activity.type === "free"
                  ? {
                      ...activity,
                      estimated:
                        Math.round(
                          Number(
                            activity.estimated ||
                              0
                          ) * 0.5
                        ),
                    }
                  : activity
            ),
        }))
      );

      addMessage(
        "assistant",
        "I reduced flexible/free-choice spending estimates by 50%. Your actual spending is unchanged."
      );

      return;
    }

    /*
     * ADD ACTIVITY
     */

    if (
      text.includes("add") ||
      text.includes("include")
    ) {
      const targetDay =
        itinerary.find(
          (day) => !day.completed
        ) || itinerary[0];

      if (targetDay) {
        const activity = {
          id: makeId(),
          title: command
            .replace(/add/gi, "")
            .replace(/include/gi, "")
            .trim(),
          type: "free",
          time: "16:00",
          estimated: 300,
          actual: null,
          completed: false,
          outdoor: false,
          weatherAffected: false,
          description:
            "Added through the TRAVELX planner assistant.",
        };

        setItinerary((current) =>
          current.map((day) =>
            day.id === targetDay.id
              ? {
                  ...day,
                  activities: [
                    ...day.activities,
                    activity,
                  ],
                }
              : day
          )
        );

        addMessage(
          "assistant",
          `Added "${activity.title}" to Day ${targetDay.dayNumber}. You can edit the time and budget.`
        );

        return;
      }
    }

    /*
     * DEFAULT
     */

    addMessage(
      "assistant",
      "I can add or remove activities, add shopping/free-choice time, make the plan cheaper, or help you adjust individual activity costs."
    );
  }

  function sendChat() {
    if (!chatInput.trim()) return;

    const command = chatInput;

    setChatInput("");

    processChat(command);
  }

  /* =======================================================
     COMPLETE TRIP
     ======================================================= */

  function completeTrip() {
    if (
      completedDays !== tripDays
    ) {
      alert(
        "Complete all trip days before marking the trip as completed."
      );
      return;
    }

    setCompletedTrip(true);

    if (trip) {
      localStorage.setItem(
        `travelx_completed_trip_${trip.id}`,
        "true"
      );

      const existing =
        JSON.parse(
          localStorage.getItem(
            "travelx_trips"
          ) || "[]"
        );

      const updated =
        existing.map((item) =>
          item.id === trip.id
            ? {
                ...item,
                completed: true,
                completedAt:
                  new Date().toISOString(),
                actualSpent: spent,
                remainingBudget:
                  remaining,
              }
            : item
        );

      localStorage.setItem(
        "travelx_trips",
        JSON.stringify(updated)
      );
    }
  }

  /* =======================================================
     NO TRIP
     ======================================================= */

  if (!trip) {
    return (
      <section className="trips-page empty-trips">

        <div className="empty-trip-icon">
          <Navigation size={30} />
        </div>

        <h1>No active trip</h1>

        <p>
          Create a trip in the planner and
          your complete itinerary will appear
          here.
        </p>

        <button
          className="trips-primary-button"
          onClick={() =>
            nav("planner")
          }
        >
          Plan a Trip
          <ArrowRight size={17} />
        </button>

      </section>
    );
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="trips-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <header className="trips-header">

        <button
          className="trips-back"
          onClick={() => nav("home")}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="trips-header-center">

          <span className="trips-kicker">
            LIVE TRIP
          </span>

          <h1>
            {trip.destination}
          </h1>

          <p>
            {formatDate(
              trip.startDate
            )}{" "}
            →{" "}
            {formatDate(
              trip.endDate
            )}
          </p>

        </div>

        <button
          className={
            showChat
              ? "trips-ai-button active"
              : "trips-ai-button"
          }
          onClick={() =>
            setShowChat(
              (value) => !value
            )
          }
        >
          <Sparkles size={16} />
          AI Plan
        </button>

      </header>

      {/* =================================================
          TRIP META
          ================================================= */}

      <div className="trip-meta-row">

        <span>
          <Navigation size={15} />
          {trip.fromLocation ||
            "Starting location"}
        </span>

        <span>
          <CalendarDays size={15} />
          {tripDays}{" "}
          {tripDays === 1
            ? "day"
            : "days"}
        </span>

        <span>
          <Wallet size={15} />
          {formatMoney(
            totalBudget
          )}{" "}
          budget
        </span>

        <span>
          {trip.travellers}{" "}
          {trip.travellers === 1
            ? "traveller"
            : "travellers"}
        </span>

      </div>

      {/* =================================================
          BUDGET PANEL
          ================================================= */}

      <section className="live-budget">

        <div className="live-budget-heading">

          <div>
            <span>
              LIVE TRIP BUDGET
            </span>

            <h2>
              Keep track as you travel.
            </h2>
          </div>

          <Wallet size={22} />

        </div>

        <div className="budget-stats">

          <div className="budget-stat">
            <span>TOTAL</span>
            <strong>
              {formatMoney(
                totalBudget
              )}
            </strong>
          </div>

          <div className="budget-stat spent">
            <span>SPENT</span>
            <strong>
              {formatMoney(spent)}
            </strong>
          </div>

          <div
            className={
              remaining < 0
                ? "budget-stat danger"
                : "budget-stat remaining"
            }
          >
            <span>
              {remaining < 0
                ? "OVER BUDGET"
                : "LEFT"}
            </span>

            <strong>
              {formatMoney(
                Math.abs(remaining)
              )}
            </strong>
          </div>

        </div>

        <div className="budget-progress">

          <div className="budget-progress-track">
            <div
              className="budget-progress-fill"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="budget-progress-labels">

            <span>
              {percentage}% spent
            </span>

            <span>
              {remaining >= 0
                ? `${formatMoney(
                    remaining
                  )} remaining`
                : `${formatMoney(
                    Math.abs(
                      remaining
                    )
                  )} over budget`}
            </span>

          </div>

        </div>

        <div className="budget-secondary-row">

          <span>
            Daily target
            <b>
              {formatMoney(
                dailyBudget
              )}
            </b>
          </span>

          <span>
            Estimated plan
            <b>
              {formatMoney(
                estimatedTotal
              )}
            </b>
          </span>

          <span>
            Activities completed
            <b>
              {
                completedActivities.length
              }
              /
              {allActivities.length}
            </b>
          </span>

        </div>

      </section>

      {/* =================================================
          JOURNEY START
          ================================================= */}

      <section className="journey-banner">

        <div className="journey-banner-icon">
          <Navigation size={22} />
        </div>

        <div>

          <span>
            JOURNEY START · DAY 1
          </span>

          <h2>
            Start your journey to{" "}
            {trip.destination}.
          </h2>

          <p>
            {trip.fromLocation ||
              "Your starting location"}{" "}
            →{" "}
            {trip.destination}
          </p>

        </div>

        <div className="journey-date">
          <strong>
            {formatShortDate(
              trip.startDate
            )}
          </strong>

          <span>
            Departure
          </span>
        </div>

      </section>

      {/* =================================================
          ITINERARY HEADER
          ================================================= */}

      <div className="itinerary-heading">

        <div>
          <span>
            FULL ITINERARY
          </span>

          <h2>
            Your journey, day by day.
          </h2>
        </div>

        <strong>
          {completedDays} /{" "}
          {tripDays} completed
        </strong>

      </div>

      {/* =================================================
          DAYS
          ================================================= */}

      <div className="trip-days">

        {itinerary.map((day) => {

          const open =
            expandedDay ===
            day.dayNumber;

          const daySpent =
            getDaySpent(day);

          const dayEstimated =
            getDayEstimated(day);

          const dayRemaining =
            getDayRemaining(day);

          const alternativeCount =
            day.activities.filter(
              (activity) =>
                activity.weatherAffected
            ).length;

          return (
            <article
              className={
                day.completed
                  ? "trip-day completed"
                  : "trip-day"
              }
              key={day.id}
            >

              {/* DAY HEADER */}

              <button
                className="trip-day-header"
                onClick={() =>
                  setExpandedDay(
                    open
                      ? null
                      : day.dayNumber
                  )
                }
              >

                <div className="day-number">
                  <span>
                    DAY
                  </span>

                  <strong>
                    {day.dayNumber}
                  </strong>
                </div>

                <div className="day-main-info">

                  <span>
                    {formatShortDate(
                      day.date
                    )}
                  </span>

                  <h2>
                    {day.dayNumber ===
                    1
                      ? "Arrival & exploration"
                      : day.dayNumber ===
                        tripDays
                      ? "Final day & return journey"
                      : `Explore ${trip.destination}`}
                  </h2>

                </div>

                <div className="day-budget-mini">

                  <span>
                    Spent
                  </span>

                  <strong>
                    {formatMoney(
                      daySpent
                    )}
                  </strong>

                </div>

                {day.completed ? (
                  <div className="day-completed-badge">
                    <Check size={14} />
                    Completed
                  </div>
                ) : (
                  <div className="day-open-icon">
                    {open ? (
                      <ChevronUp
                        size={18}
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                      />
                    )}
                  </div>
                )}

              </button>

              {open && (
                <div className="trip-day-body">

                  {/* DAY BUDGET */}

                  <div className="day-budget-panel">

                    <div>
                      <span>
                        DAY BUDGET
                      </span>

                      <strong>
                        {formatMoney(
                          dailyBudget
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        ESTIMATED
                      </span>

                      <strong>
                        {formatMoney(
                          dayEstimated
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        ACTUAL
                      </span>

                      <strong>
                        {formatMoney(
                          daySpent
                        )}
                      </strong>
                    </div>

                    <div
                      className={
                        dayRemaining < 0
                          ? "negative"
                          : ""
                      }
                    >
                      <span>
                        DAY LEFT
                      </span>

                      <strong>
                        {dayRemaining >=
                        0
                          ? formatMoney(
                              dayRemaining
                            )
                          : `-${formatMoney(
                              Math.abs(
                                dayRemaining
                              )
                            )}`}
                      </strong>
                    </div>

                  </div>

                  {/* WEATHER */}

                  <div className="weather-panel">

                    <div className="weather-icon">
                      {day.weather?.bad ? (
                        <CloudRain
                          size={21}
                        />
                      ) : (
                        <CloudSun
                          size={21}
                        />
                      )}
                    </div>

                    <div>

                      <strong>
                        {day.weather
                          ? day.weather
                              .label ||
                            "Weather checked"
                          : "Weather"}
                      </strong>

                      <span>
                        {day.weather
                          ? day.weather
                              .description ||
                            "Weather information available."
                          : "Check weather before heading outdoors."}
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        checkWeather(
                          day
                        )
                      }
                      disabled={
                        weatherLoading
                      }
                    >
                      {weatherLoading
                        ? "Checking..."
                        : "Check"}
                    </button>

                  </div>

                  {/* WEATHER AFFECTED */}

                  {alternativeCount >
                    0 && (
                    <div className="weather-alert">

                      <CloudRain
                        size={17}
                      />

                      <div>

                        <strong>
                          Weather may affect your plan
                        </strong>

                        <span>
                          {
                            alternativeCount
                          }{" "}
                          outdoor{" "}
                          {alternativeCount ===
                          1
                            ? "activity"
                            : "activities"}{" "}
                          may need an alternative.
                        </span>

                      </div>

                    </div>
                  )}

                  {/* TIMELINE */}

                  <div className="activity-timeline">

                    {day.activities.map(
                      (
                        activity,
                        activityIndex
                      ) => {

                        const Icon =
                          activityTypes.find(
                            (item) =>
                              item.id ===
                              activity.type
                          )?.icon ||
                          Sparkles;

                        const alternative =
                          weatherAlternative(
                            activity
                          );

                        return (
                          <div
                            className={
                              activity.completed
                                ? "activity-row completed"
                                : activity.weatherAffected
                                ? "activity-row weather-affected"
                                : "activity-row"
                            }
                            key={
                              activity.id
                            }
                          >

                            <div className="activity-time">
                              {
                                activity.time
                              }
                            </div>

                            <div className="activity-line">

                              <div className="activity-marker">
                                <Icon
                                  size={13}
                                />
                              </div>

                              {activityIndex !==
                                day
                                  .activities
                                  .length -
                                  1 && (
                                <div className="activity-connector" />
                              )}

                            </div>

                            <div className="activity-content">

                              <div className="activity-top">

                                <span className="activity-type">
                                  {
                                    activityTypes.find(
                                      (
                                        item
                                      ) =>
                                        item.id ===
                                        activity.type
                                    )?.label ||
                                    "Activity"
                                  }
                                </span>

                                {activity.completed && (
                                  <span className="activity-done">
                                    <Check
                                      size={
                                        11
                                      }
                                    />
                                    Done
                                  </span>
                                )}

                              </div>

                              <h3>
                                {
                                  activity.title
                                }
                              </h3>

                              <p>
                                {
                                  activity.description
                                }
                              </p>

                              {activity.weatherAffected &&
                                alternative && (
                                  <div className="activity-weather-option">

                                    <Sun
                                      size={
                                        15
                                      }
                                    />

                                    <div>

                                      <strong>
                                        {
                                          alternative.title
                                        }
                                      </strong>

                                      <span>
                                        {
                                          alternative.description
                                        }
                                      </span>

                                    </div>

                                  </div>
                                )}

                              {/* ACTUAL SPENDING */}

                              <div className="activity-cost">

                                <div className="estimated-cost">
                                  <span>
                                    Planned
                                  </span>

                                  <strong>
                                    {formatMoney(
                                      activity.estimated
                                    )}
                                  </strong>
                                </div>

                                <div className="actual-cost">

                                  <label>
                                    <span>
                                      Actual spent
                                    </span>

                                    <div className="actual-input">

                                      <span>
                                        ₹
                                      </span>

                                      <input
                                        type="number"
                                        min="0"
                                        value={
                                          activity.actual ??
                                          ""
                                        }
                                        placeholder={
                                          activity.estimated
                                        }
                                        onChange={(
                                          e
                                        ) =>
                                          updateActual(
                                            day.id,
                                            activity.id,
                                            e
                                              .target
                                              .value
                                          )
                                        }
                                      />

                                    </div>

                                  </label>

                                </div>

                              </div>

                              {/* ACTIONS */}

                              <div className="activity-actions">

                                <button
                                  onClick={() =>
                                    toggleActivity(
                                      day.id,
                                      activity.id
                                    )
                                  }
                                >
                                  {activity.completed ? (
                                    <>
                                      <Check
                                        size={
                                          14
                                        }
                                      />
                                      Completed
                                    </>
                                  ) : (
                                    "Mark done"
                                  )}
                                </button>

                                <button
                                  onClick={() =>
                                    openEditActivity(
                                      day.id,
                                      activity
                                    )
                                  }
                                >
                                  <Edit3
                                    size={
                                      13
                                    }
                                  />
                                  Edit
                                </button>

                                <button
                                  className="danger"
                                  onClick={() =>
                                    deleteActivity(
                                      day.id,
                                      activity.id
                                    )
                                  }
                                >
                                  <Trash2
                                    size={
                                      13
                                    }
                                  />
                                </button>

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* ADD ACTIVITY */}

                  <button
                    className="add-activity-button"
                    onClick={() =>
                      openAddActivity(
                        day.id
                      )
                    }
                  >
                    <Plus size={16} />
                    Add your own activity
                  </button>

                  {/* DAY FOOTER */}

                  <div className="day-footer">

                    <div>

                      <span>
                        DAY {day.dayNumber} BALANCE
                      </span>

                      <strong
                        className={
                          dayRemaining <
                          0
                            ? "negative"
                            : ""
                        }
                      >
                        {dayRemaining >=
                        0
                          ? `${formatMoney(
                              dayRemaining
                            )} left`
                          : `${formatMoney(
                              Math.abs(
                                dayRemaining
                              )
                            )} over`}
                      </strong>

                    </div>

                    <button
                      className={
                        day.completed
                          ? "complete-day completed"
                          : "complete-day"
                      }
                      onClick={() =>
                        completeDay(
                          day.id
                        )
                      }
                    >
                      {day.completed ? (
                        <>
                          <Check
                            size={16}
                          />
                          Day Completed
                        </>
                      ) : (
                        <>
                          <Check
                            size={16}
                          />
                          Complete Day
                        </>
                      )}
                    </button>

                  </div>

                </div>
              )}

            </article>
          );
        })}

      </div>

      {/* =================================================
          FINAL RETURN
          ================================================= */}

      <section className="return-banner">

        <div className="return-icon">
          <ArrowRight size={21} />
        </div>

        <div>

          <span>
            JOURNEY COMPLETE
          </span>

          <h2>
            {trip.destination} →{" "}
            {trip.fromLocation ||
              "Starting location"}
          </h2>

          <p>
            Your return journey is included
            on the final trip date.
          </p>

        </div>

        <strong>
          {formatShortDate(
            trip.endDate
          )}
        </strong>

      </section>

      {/* =================================================
          FINAL SUMMARY
          ================================================= */}

      <section className="final-budget-card">

        <div>

          <span>
            FINAL TRIP SPENDING
          </span>

          <h2>
            {formatMoney(spent)}
          </h2>

          <p>
            of {formatMoney(totalBudget)}{" "}
            budget used
          </p>

        </div>

        <div className="final-budget-result">

          <span>
            {remaining >= 0
              ? "MONEY LEFT"
              : "OVER BUDGET"}
          </span>

          <strong>
            {formatMoney(
              Math.abs(remaining)
            )}
          </strong>

        </div>

      </section>

      {/* =================================================
          COMPLETE TRIP
          ================================================= */}

      {completedTrip ? (
        <section className="trip-completed-card">

          <div className="trip-completed-icon">
            <Check size={25} />
          </div>

          <div>

            <span>
              TRIP COMPLETED
            </span>

            <h2>
              What a journey!
            </h2>

            <p>
              Your final spending was{" "}
              <strong>
                {formatMoney(spent)}
              </strong>{" "}
              and you had{" "}
              <strong>
                {formatMoney(
                  Math.abs(remaining)
                )}
              </strong>{" "}
              {remaining >= 0
                ? "left."
                : "over budget."}
            </p>

          </div>

        </section>
      ) : (
        <section className="complete-trip-section">

          <div>

            <span>
              FINISHED ALL YOUR DAYS?
            </span>

            <h2>
              Complete your trip.
            </h2>

            <p>
              You can complete the trip after
              all {tripDays} days are marked
              complete.
            </p>

          </div>

          <button
            className="complete-trip-button"
            onClick={
              completeTrip
            }
            disabled={
              completedDays !==
              tripDays
            }
          >
            <Check size={18} />
            Complete Trip
          </button>

        </section>
      )}

      {/* =================================================
          AI CHAT
          ================================================= */}

      {showChat && (
        <aside className="trip-ai-chat">

          <div className="trip-ai-header">

            <div>

              <span>
                TRAVELX AI
              </span>

              <strong>
                Change your plan
              </strong>

            </div>

            <button
              onClick={() =>
                setShowChat(false)
              }
            >
              <X size={17} />
            </button>

          </div>

          <div className="trip-ai-suggestions">

            <button
              onClick={() =>
                processChat(
                  "Add shopping ₹1000"
                )
              }
            >
              <ShoppingBag size={13} />
              Add shopping
            </button>

            <button
              onClick={() =>
                processChat(
                  "Make the plan cheaper"
                )
              }
            >
              <Wallet size={13} />
              Save money
            </button>

            <button
              onClick={() =>
                processChat(
                  "Add a free choice activity"
                )
              }
            >
              <Sparkles size={13} />
              Add free time
            </button>

          </div>

          <div className="trip-ai-messages">

            {messages.map(
              (message) => (
                <div
                  key={message.id}
                  className={
                    message.role ===
                    "user"
                      ? "ai-message user"
                      : "ai-message"
                  }
                >
                  {message.text}
                </div>
              )
            )}

          </div>

          <div className="trip-ai-input">

            <input
              value={chatInput}
              onChange={(e) =>
                setChatInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  sendChat();
                }
              }}
              placeholder="e.g. Add shopping ₹2000"
            />

            <button
              onClick={sendChat}
            >
              <Send size={16} />
            </button>

          </div>

        </aside>
      )}

      {/* =================================================
          ADD / EDIT MODAL
          ================================================= */}

      {(addingToDay ||
        editingActivity) && (
        <div className="trip-modal-overlay">

          <div className="trip-modal">

            <div className="trip-modal-header">

              <div>

                <span>
                  {addingToDay
                    ? "ADD ACTIVITY"
                    : "EDIT ACTIVITY"}
                </span>

                <h2>
                  Plan your time.
                </h2>

              </div>

              <button
                onClick={() => {
                  setAddingToDay(
                    null
                  );
                  setEditingActivity(
                    null
                  );
                }}
              >
                <X size={18} />
              </button>

            </div>

            <div className="trip-modal-form">

              <label>
                Activity name

                <input
                  value={
                    activityForm.title
                  }
                  onChange={(e) =>
                    setActivityForm(
                      (current) => ({
                        ...current,
                        title:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="e.g. Café, shopping, museum"
                />
              </label>

              <div className="modal-two-columns">

                <label>
                  Type

                  <select
                    value={
                      activityForm.type
                    }
                    onChange={(e) =>
                      setActivityForm(
                        (current) => ({
                          ...current,
                          type:
                            e.target.value,
                        })
                      )
                    }
                  >
                    {activityTypes.map(
                      (type) => (
                        <option
                          key={type.id}
                          value={
                            type.id
                          }
                        >
                          {type.label}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  Time

                  <input
                    type="time"
                    value={
                      activityForm.time
                    }
                    onChange={(e) =>
                      setActivityForm(
                        (current) => ({
                          ...current,
                          time:
                            e.target.value,
                        })
                      )
                    }
                  />
                </label>

              </div>

              <label>
                Planned budget

                <div className="modal-money-input">
                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      activityForm.estimated
                    }
                    onChange={(e) =>
                      setActivityForm(
                        (current) => ({
                          ...current,
                          estimated:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="0"
                  />
                </div>

              </label>

              <label>
                Description

                <textarea
                  value={
                    activityForm.description
                  }
                  onChange={(e) =>
                    setActivityForm(
                      (current) => ({
                        ...current,
                        description:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="What do you want to do?"
                />

              </label>

            </div>

            <div className="trip-modal-actions">

              <button
                className="modal-cancel"
                onClick={() => {
                  setAddingToDay(
                    null
                  );
                  setEditingActivity(
                    null
                  );
                }}
              >
                Cancel
              </button>

              <button
                className="modal-save"
                onClick={
                  addingToDay
                    ? saveNewActivity
                    : saveEditedActivity
                }
              >
                <Save size={15} />

                {addingToDay
                  ? "Add Activity"
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default Trips;