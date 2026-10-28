
import { useState } from "react";
import "./Auth.css";

const AUTH_URL =
  "https://imovies-backend-axjk.onrender.com/api/auth";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function changeMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const endpoint =
        mode === "signup" ? "signup" : "login";

      const response = await fetch(
        `${AUTH_URL}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(mode === "signup" ? { name: name.trim() } : {}),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to complete your request."
        );
      }

      if (!data.token || !data.user) {
        throw new Error(
          "Unexpected server response. Please try again."
        );
      }

      localStorage.setItem("imovies_token", data.token);

      onLogin(data.user);
    } catch (error) {
      setIsError(true);

      if (
        error instanceof TypeError ||
        error.message.toLowerCase().includes("failed to fetch")
      ) {
        setMessage(
          "Server se connection nahi ho raha. Backend URL aur server status check karo."
        );
      } else {
        setMessage(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <a className="auth-brand" href="#home">
        <span>▶</span> IMOVIES
      </a>

      <div className="auth-layout">
        <section className="auth-intro">
          <p className="auth-eyebrow">
            YOUR CINEMA EXPERIENCE
          </p>

          <h1>
            YOUR NEXT
            <br />
            STORY STARTS
            <br />
            <span>HERE.</span>
          </h1>

          <p className="auth-description">
            Discover movies, pick your favourite seats, and
            make every movie night memorable.
          </p>

          <div className="auth-feature-list">
            <div>
              <span>✦</span> Discover exciting movies
            </div>
            <div>
              <span>✦</span> Choose your favourite seats
            </div>
            <div>
              <span>✦</span> Keep track of your demo bookings
            </div>
          </div>

          <div className="auth-decoration">
            <div className="auth-film-symbol">▶</div>
            <span>LIGHTS. CAMERA. IMOVIES.</span>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-top">
            <span className="auth-card-label">
              WELCOME TO IMOVIES
            </span>

            <span className="auth-status">
              <i /> YOUR MOVIE SPACE
            </span>
          </div>

          <h2>
            {mode === "login"
              ? "Welcome back."
              : "Create your account."}
          </h2>

          <p className="auth-subtitle">
            {mode === "login"
              ? "Log in to continue your cinema journey."
              : "Join IMovies and discover your next favourite film."}
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "selected" : ""}
              onClick={() => changeMode("login")}
              disabled={loading}
            >
              Login
            </button>

            <button
              type="button"
              className={mode === "signup" ? "selected" : ""}
              onClick={() => changeMode("signup")}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="auth-field">
                <span>Full name</span>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  autoComplete="name"
                  maxLength={60}
                  required
                />
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>

              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete={
                    mode === "signup"
                      ? "new-password"
                      : "current-password"
                  }
                  minLength={8}
                  required
                />

                <button
                  className="show-password"
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {message && (
              <p
                role="alert"
                className={`auth-message ${
                  isError ? "error" : "success"
                }`}
              >
                {message}
              </p>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Login to IMovies ↗"
                  : "Create Account ↗"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login"
              ? "New to IMovies?"
              : "Already have an account?"}{" "}

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                changeMode(
                  mode === "login" ? "signup" : "login"
                )
              }
            >
              {mode === "login"
                ? "Create account"
                : "Login"}
            </button>
          </p>

          <p className="auth-demo-note">
            Student demo project · No payment required
          </p>
        </section>
      </div>

      <footer className="auth-footer">
        MADE WITH ♥ BY TANU RAJPUT
      </footer>
    </main>
  );
}
