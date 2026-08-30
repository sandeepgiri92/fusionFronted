import logo from "@/assets/fusion logo.png";

import { useGetMeQuery, useLoginMutation } from "@/features/auth/authApi";

import LoadingScreen from "@/loadingScreen/LoadingScreen";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();

  const { isLoading } = useGetMeQuery();

  const [login, { isLoading: loggingIn, error }] = useLoginMutation();

  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    email: import.meta.env.VITE_USERNAME || "",
    password: "",
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  const submit = async (e) => {
    e.preventDefault();

    try {
      await login(form).unwrap();

      nav("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login-page">
      <section className="login-art">
        <div className="art-content">
          <img src={logo} />

          <h1>
            Run your
            <br />
            <span style={{ color: "#86a7ff" }}>business</span> smarter.
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

      <section className="login-card-wrap">
        <div className="login-card">
          <div className="login-brand">
            <img src={logo} />
            <b>FUSION</b>
          </div>

          <h2>Welcome back</h2>

          <p className="lead">
            Sign in to continue to your business workspace.
          </p>

          <form className="login-form" onSubmit={submit}>
            <div className="field">
              <label>Email address</label>

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
                  className="input"
                  style={{ paddingLeft: 34 }}
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Password</label>

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
                  className="input"
                  style={{ paddingLeft: 34 }}
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter password"
                  required
                />

                <button
                  type="button"
                  className="icon-btn eye"
                  onClick={() => setShow((prev) => !prev)}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-box">
                {error?.data?.message ||
                  "Unable to sign in. Please check your details."}
              </div>
            )}

            <Link className="forgot" to="/admin/forgot-password">
              Forgot password?
            </Link>

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

          <div className="login-footer">
            © 2026 Fusion Enterprise Suite · Secure admin portal
          </div>
        </div>
      </section>
    </div>
  );
}
