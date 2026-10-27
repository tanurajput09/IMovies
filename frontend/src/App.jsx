
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Auth from "./Auth";

const USER_KEY = "imovies_current_user";
const STORAGE_KEY = "imovies_demo_bookings";
const PRICE = 250;

const CATEGORIES = ["All", "Sci-Fi", "Action", "Drama", "Thriller", "Adventure"];

const TIMES = [
  "10:00 AM",
  "01:30 PM",
  "04:30 PM",
  "06:30 PM",
  "09:30 PM",
];

const SEATS = Array.from({ length: 24 }, (_, i) => ({
  id: `${String.fromCharCode(65 + Math.floor(i / 6))}${(i % 6) + 1}`,
}));

// Local demo movie list with poster image URLs.
const MOVIES = [
  {
    id: "m1",
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: "8.7",
    year: 2014,
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: "m2",
    title: "Inception",
    genre: "Sci-Fi",
    rating: "8.8",
    year: 2010,
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: "m3",
    title: "The Dark Knight",
    genre: "Action",
    rating: "9.0",
    year: 2008,
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: "m4",
    title: "Dune: Part Two",
    genre: "Adventure",
    rating: "8.5",
    year: 2024,
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  },
  {
    id: "m5",
    title: "Avatar: The Way of Water",
    genre: "Adventure",
    rating: "7.6",
    year: 2022,
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
  },
  {
    id: "m6",
    title: "Avengers: Endgame",
    genre: "Action",
    rating: "8.4",
    year: 2019,
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
  },
  {
    id: "m7",
    title: "Spider-Man: No Way Home",
    genre: "Action",
    rating: "8.2",
    year: 2021,
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  },
  {
    id: "m8",
    title: "Joker",
    genre: "Drama",
    rating: "8.4",
    year: 2019,
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  },
  {
    id: "m9",
    title: "Top Gun: Maverick",
    genre: "Action",
    rating: "8.2",
    year: 2022,
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
  },
  {
    id: "m10",
    title: "The Batman",
    genre: "Thriller",
    rating: "7.8",
    year: 2022,
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  },
  {
    id: "m11",
    title: "Doctor Strange",
    genre: "Adventure",
    rating: "7.5",
    year: 2016,
    poster: "https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
  },
  {
    id: "m12",
    title: "Black Panther",
    genre: "Action",
    rating: "7.3",
    year: 2018,
    poster: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
  },
  {
    id: "m13",
    title: "Guardians of the Galaxy Vol. 3",
    genre: "Adventure",
    rating: "7.9",
    year: 2023,
    poster: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
  },
  {
    id: "m14",
    title: "The Martian",
    genre: "Sci-Fi",
    rating: "8.0",
    year: 2015,
    poster: "https://image.tmdb.org/t/p/w500/3ndAx3weG6KDkJIRMCi5vXX6Dyb.jpg",
  },
  {
    id: "m15",
    title: "La La Land",
    genre: "Drama",
    rating: "8.0",
    year: 2016,
    poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
  },
  {
    id: "m16",
    title: "Tenet",
    genre: "Thriller",
    rating: "7.3",
    year: 2020,
    poster: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
  },
];

function readLocalJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    readLocalJSON(USER_KEY, null)
  );

  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState("06:30 PM");
  const [seats, setSeats] = useState([]);
  const [bookings, setBookings] = useState(() =>
    readLocalJSON(STORAGE_KEY, [])
  );
  const [notice, setNotice] = useState("");

  const today = getToday();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      const matchesCategory =
        active === "All" ||
        movie.genre.toLowerCase() === active.toLowerCase();

      const query = search.toLowerCase();

      const matchesSearch =
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [active, search]);

  const myBookings = bookings.filter(
    (booking) => booking.userEmail === currentUser?.email
  );

  function handleLogin(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
    setNotice("");
  }

  function handleLogout() {
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
    setSelected(null);
    setSeats([]);
    setNotice("");
  }

  function openBooking(movie) {
    setSelected(movie);
    setSeats([]);
    setTime("06:30 PM");
    setNotice("");

    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function toggleSeat(seatId) {
    if (!selected) {
      setNotice("Pehle movie select karo.");
      return;
    }

    const alreadyBooked = bookings.some(
      (booking) =>
        booking.date === today &&
        booking.title === selected.title &&
        booking.time === time &&
        booking.seats.includes(seatId)
    );

    if (alreadyBooked) {
      setNotice(`Seat ${seatId} is already booked for this show.`);
      return;
    }

    setSeats((previous) =>
      previous.includes(seatId)
        ? previous.filter((seat) => seat !== seatId)
        : [...previous, seatId]
    );

    setNotice("");
  }

  function confirmBooking() {
    if (!currentUser) {
      setNotice("Booking ke liye pehle login karo.");
      return;
    }

    if (!selected) {
      setNotice("Pehle movie select karo.");
      return;
    }

    if (seats.length === 0) {
      setNotice("Kam se kam ek seat select karo.");
      return;
    }

    // Recheck seats before saving.
    const conflict = bookings.some(
      (booking) =>
        booking.date === today &&
        booking.title === selected.title &&
        booking.time === time &&
        booking.seats.some((seat) => seats.includes(seat))
    );

    if (conflict) {
      setNotice("Koi selected seat abhi book ho chuki hai. Doosri seat choose karo.");
      setSeats([]);
      return;
    }

    const booking = {
      id: `IM-${Date.now()}`,
      bookingCode: `IM${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      userEmail: currentUser.email,
      title: selected.title,
      genre: selected.genre,
      date: today,
      time,
      seats: [...seats],
      total: seats.length * PRICE,
    };

    setBookings((previous) => [booking, ...previous]);
    setSeats([]);
    setNotice(`Booking confirmed! Booking ID: ${booking.bookingCode}`);

    setTimeout(() => {
      document.getElementById("my-bookings")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  }

  function removeBooking(id) {
    setBookings((previous) =>
      previous.filter((booking) => booking.id !== id)
    );
    setNotice("Booking successfully cancelled.");
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">▶</span> IMOVIES
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#booking">Book Tickets</a>
          <a href="#my-bookings">My Bookings</a>
        </nav>

        <div className="user-actions">
          <span className="welcome-user">
            Hi, {currentUser.name?.split(" ")[0] || "User"}
          </span>
          <button className="nav-cta" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">YOUR NEXT MOVIE EXPERIENCE</p>
            <h1>
              EVERY STORY
              <br />
              DESERVES A <span>BIG SCREEN.</span>
            </h1>
            <p className="hero-description">
              Discover unforgettable stories, choose your favourite seats,
              and make your next movie night special.
            </p>

            <div className="hero-actions">
              <a className="primary-btn" href="#movies">
                Explore Movies <span>↗</span>
              </a>
              <a className="secondary-btn" href="#my-bookings">
                My Bookings
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>{MOVIES.length}</strong>
                <span>Movies</span>
              </div>
              <div>
                <strong>₹{PRICE}</strong>
                <span>Per Seat</span>
              </div>
              <div>
                <strong>4K</strong>
                <span>Cinematic Vibes</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-ticket">
              <span className="ticket-top">IMOVIES ORIGINAL</span>
              <div className="ticket-play">▶</div>
              <h2>YOUR NIGHT.</h2>
              <h2>YOUR MOVIE.</h2>
              <p>THE SHOW STARTS HERE.</p>
              <div className="ticket-bottom">
                <span>ADMIT ONE</span>
                <span>IM • 001</span>
              </div>
            </div>
          </div>
        </section>

        <section className="movies-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CURATED FOR YOUR SCREEN</p>
              <h2>
                Now Showing<span>.</span>
              </h2>
              <p className="section-description">
                Find your next favourite film.
              </p>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                placeholder="Search movies or genres..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Clear search">
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="category-list">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`category-btn ${active === category ? "active" : ""}`}
                onClick={() => setActive(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredMovies.length === 0 ? (
            <div className="empty-state">No movies found. Try another search.</div>
          ) : (
            <div className="movie-grid">
              {filteredMovies.map((movie, index) => (
                <article className="movie-card" key={movie.id}>
                  <div
                    className={`movie-poster poster-${index % 4}`}
                    style={{ position: "relative", overflow: "hidden" }}
                  >
                    <img
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <span className="poster-number" style={{ position: "relative" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="poster-play" style={{ position: "relative" }}>
                      ▶
                    </span>
                    <span className="poster-title" style={{ position: "relative" }}>
                      {movie.title}
                    </span>
                    <span className="poster-tag" style={{ position: "relative" }}>
                      NOW SHOWING
                    </span>
                  </div>

                  <div className="movie-info">
                    <div className="movie-meta">
                      <span>{movie.genre}</span>
                      <span className="rating">★ {movie.rating}</span>
                    </div>
                    <h3>{movie.title}</h3>
                    <div className="movie-card-bottom">
                      <span className="movie-price">₹{PRICE}/seat</span>
                      <button className="book-btn" onClick={() => openBooking(movie)}>
                        Book Now ↗
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="booking-section" id="booking">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR CINEMA, YOUR CHOICE</p>
              <h2>
                Book Your Seats<span>.</span>
              </h2>
              <p className="section-description">
                Select a movie, showtime, and your favourite seats.
              </p>
            </div>
          </div>

          {!selected ? (
            <div className="empty-state">
              Select a movie above and click Book Now to start your booking.
            </div>
          ) : (
            <div className="booking-panel">
              <div className="booking-details">
                <p className="eyebrow">SELECTED MOVIE</p>
                <h3>{selected.title}</h3>
                <p>{selected.genre} · ★ {selected.rating}</p>

                <label className="field-label" htmlFor="showtime">
                  Choose showtime
                </label>
                <select
                  id="showtime"
                  value={time}
                  onChange={(event) => {
                    setTime(event.target.value);
                    setSeats([]);
                    setNotice("");
                  }}
                >
                  {TIMES.map((showTime) => (
                    <option key={showTime} value={showTime}>
                      {showTime}
                    </option>
                  ))}
                </select>

                <div className="booking-summary">
                  <div>
                    <span>Selected seats</span>
                    <strong>{seats.length ? seats.join(", ") : "None"}</strong>
                  </div>
                  <div>
                    <span>Price per seat</span>
                    <strong>₹{PRICE}</strong>
                  </div>
                  <div>
                    <span>Total amount</span>
                    <strong>₹{seats.length * PRICE}</strong>
                  </div>
                </div>

                <button className="primary-btn confirm-btn" onClick={confirmBooking}>
                  Confirm Booking ↗
                </button>
                <p className="small-note">
                  Demo only — no real payment is collected.
                </p>
              </div>

              <div className="seat-selection">
                <p className="eyebrow">SCREEN THIS WAY</p>
                <div className="cinema-screen">SCREEN</div>

                <div className="seat-grid">
                  {SEATS.map((seat) => {
                    const isBooked = bookings.some(
                      (booking) =>
                        booking.date === today &&
                        booking.title === selected.title &&
                        booking.time === time &&
                        booking.seats.includes(seat.id)
                    );
                    const isSelected = seats.includes(seat.id);

                    return (
                      <button
                        key={seat.id}
                        className={`seat ${isBooked ? "booked" : isSelected ? "selected" : ""}`}
                        disabled={isBooked}
                        onClick={() => toggleSeat(seat.id)}
                        aria-label={`Seat ${seat.id}`}
                        aria-pressed={isSelected}
                        title={isBooked ? "Already booked" : `Seat ${seat.id}`}
                      >
                        {seat.id}
                      </button>
                    );
                  })}
                </div>

                <div className="seat-legend">
                  <span><i className="legend-seat available" /> Available</span>
                  <span><i className="legend-seat chosen" /> Selected</span>
                  <span><i className="legend-seat booked-legend" /> Booked</span>
                </div>
              </div>
            </div>
          )}

          {notice && <p className="notice">{notice}</p>}
        </section>

        <section className="booking-history" id="my-bookings">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR TICKETS, ALL IN ONE PLACE</p>
              <h2>
                My Bookings<span>.</span>
              </h2>
              <p className="section-description">
                Your demo bookings saved in this browser.
              </p>
            </div>
            <span className="booking-count">
              {myBookings.length} {myBookings.length === 1 ? "BOOKING" : "BOOKINGS"}
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>No bookings yet</h3>
              <p>Your confirmed tickets will appear here.</p>
              <a className="secondary-btn" href="#movies">Browse Movies</a>
            </div>
          ) : (
            <div className="bookings-list">
              {myBookings.map((booking) => (
                <article className="booking-card" key={booking.id}>
                  <div className="booking-card-icon">▶</div>
                  <div className="booking-card-info">
                    <h3>{booking.title}</h3>
                    <p>Booking ID: {booking.bookingCode} · {booking.date}</p>
                    <p>Showtime: {booking.time} · Seats: {booking.seats.join(", ")}</p>
                  </div>
                  <div className="booking-card-total">
                    <span>Total</span>
                    <strong>₹{booking.total}</strong>
                    <button
                      className="remove-booking-btn"
                      onClick={() => removeBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-icon">▶</span> IMOVIES
        </a>
        <p>Every story deserves a big screen.</p>
        <p className="footer-credit">Made with ♥ by Tanu Rajput</p>
        <span>© {new Date().getFullYear()} IMovies · Student demo project</span>
      </footer>
    </div>
  );
}
