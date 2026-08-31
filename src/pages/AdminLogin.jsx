import logo from "@/assets/fusion logo.png";

import { useGetMeQuery, useLoginMutation } from "@/features/auth/authApi";

import LoadingScreen from "@/loadingScreen/LoadingScreen";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();

  // ============================================================
  // CHECK EXISTING LOGIN SESSION
  // ============================================================

  const { isLoading: checkingSession } = useGetMeQuery();

  // ============================================================
  // LOGIN MUTATION
  // ============================================================

  const [login, { isLoading: loggingIn, error }] = useLoginMutation();

  // ============================================================
  // STATES
  // ============================================================

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: import.meta.env.VITE_USERNAME || "",
    password: "",
  });

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (checkingSession) {
    return <LoadingScreen />;
  }

  // ============================================================
  // LOGIN SUBMIT
  // ============================================================

  const submit = async (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();

    const password = form.password;

    // Basic frontend validation

    if (!email || !password) {
      return;
    }

    try {
      await login({
        email,
        password,
      }).unwrap();

      // Login successful

      nav("/", {
        replace: true,
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-page">
      {/* ======================================================
          LEFT ART SECTION
      ======================================================= */}

      <section className="login-art">
        <div className="art-content">
          <img src={logo} alt="Fusion Enterprise" />

          <h1>
            Run your
            <br />
            <span
              style={{
                color: "#86a7ff",
              }}
            >
              business
            </span>{" "}
            smarter.
          </h1>

          <p>
            Fusion brings sales, purchases, services, expenses and payment
            tracking into one focused workspace.
          </p>

          <div className="feature-pills">
            <span>Live payment tracking</span>

            <span>Fast entry management</span>

            <span>Secure admin access</span>
          </div>
        </div>
      </section>

      {/* ======================================================
          LOGIN CARD
      ======================================================= */}

      <section className="login-card-wrap">
        <div className="login-card">
          {/* BRAND */}

          <div className="login-brand">
            <img src={logo} alt="Fusion" />

            <b>FUSION</b>
          </div>

          {/* TITLE */}

          <h2>Welcome back</h2>

          <p className="lead">
            Sign in to continue to your business workspace.
          </p>

          {/* ==================================================
              LOGIN FORM
          =================================================== */}

          <form className="login-form" onSubmit={submit}>
            {/* EMAIL */}

            <div className="field">
              <label htmlFor="login-email">Email address</label>

              <div className="password-wrap">
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: 11,
                    color: "#94a3b8",
                  }}
                />

                <input
                  id="login-email"
                  name="email"
                  className="input"
                  style={{
                    paddingLeft: 34,
                  }}
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="field">
              <label htmlFor="login-password">Password</label>

              <div className="password-wrap">
                <LockKeyhole
                  size={16}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: 11,
                    color: "#94a3b8",
                  }}
                />

                <input
                  id="login-password"
                  name="password"
                  className="input"
                  style={{
                    paddingLeft: 34,
                    paddingRight: 42,
                  }}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />

                {/* SHOW / HIDE PASSWORD */}

                <button
                  type="button"
                  className="icon-btn eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* ==================================================
                LOGIN ERROR
            =================================================== */}

            {error && (
              <div className="error-box">
                {error?.data?.message ||
                  error?.error ||
                  "Unable to sign in. Please check your details."}
              </div>
            )}

            {/* ==================================================
                FORGOT PASSWORD
            =================================================== */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 4,
              }}
            >
              <Link className="forgot" to="/admin/forgot-password">
                Forgot password?
              </Link>
            </div>

            {/* ==================================================
                LOGIN BUTTON
            =================================================== */}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                justifyContent: "center",
                padding: "12px",
              }}
              disabled={loggingIn}
            >
              {loggingIn ? (
                "Signing you in…"
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}

          <div className="login-footer">
            © 2026 Fusion Enterprise Suite · Secure admin portal
          </div>
        </div>
      </section>
    </div>
  );
}
