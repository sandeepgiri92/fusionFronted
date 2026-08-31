import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react";
import { useForgotPasswordMutation, useResetPasswordMutation } from "@/features/auth/authApi";
import logo from "@/assets/fusion logo.png";
import Toast from "@/components/Toast";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const [forgot, { isLoading: sendLoading }] = useForgotPasswordMutation();
  const [reset, { isLoading: resetLoading }] = useResetPasswordMutation();

  const send = async (e) => {
    e.preventDefault();

    try {
      const response = await forgot({ email: email.trim().toLowerCase() }).unwrap();
      setToast(response.message || "If the account exists, an OTP has been sent.");
      setStep(2);
    } catch (err) {
      setToast(err?.data?.message || "Unable to send OTP");
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToast("Passwords do not match");
      return;
    }

    try {
      await reset({
        email: email.trim().toLowerCase(),
        otp,
        newPassword: password,
      }).unwrap();

      setToast("Password reset successfully. Redirecting to login…");
      setTimeout(() => nav("/admin/login", { replace: true }), 900);
    } catch (err) {
      setToast(err?.data?.message || "Unable to reset password");
    }
  };

  return (
    <div className="login-page">
      <section className="login-art">
        <div className="art-content">
          <img src={logo} />
          <h1>
            Secure access,
            <br />
            <span style={{ color: "#86a7ff" }}>restored.</span>
          </h1>
          <p>
            Reset your Fusion admin password with a one-time verification code
            sent to the email registered in your admin account.
          </p>
          <div className="feature-pills">
            <span>10 minute OTP</span>
            <span>Argon2 password hashing</span>
            <span>Secure session cookies</span>
          </div>
        </div>
      </section>

      <section className="login-card-wrap">
        <div className="login-card">
          <div className="login-brand">
            <img src={logo} />
            <b>FUSION</b>
          </div>

          <Link
            to="/admin/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#64748b",
              textDecoration: "none",
              marginBottom: 20,
            }}
          >
            <ArrowLeft size={14} /> Back to login
          </Link>

          {step === 1 ? (
            <>
              <h2>Forgot password?</h2>
              <p className="lead">
                Enter the email address registered in your Fusion admin account.
              </p>

              <form className="login-form" onSubmit={send}>
                <div className="field">
                  <label>Registered email</label>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ justifyContent: "center" }}
                  disabled={sendLoading}
                >
                  {sendLoading
                    ? "Sending OTP…"
                    : "Send OTP"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Verify & reset</h2>
              <p className="lead">
                Enter the 6-digit OTP sent to <b>{email}</b>.
              </p>

              <form className="login-form" onSubmit={submit}>
                <div className="field">
                  <label>6-digit OTP</label>
                  <div className="password-wrap">
                    <ShieldCheck
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
                      style={{ paddingLeft: 34, letterSpacing: ".25em" }}
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>New password</label>
                  <div className="password-wrap">
                    <KeyRound
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
                      style={{ paddingLeft: 34, paddingRight: 38 }}
                      type={showPassword ? "text" : "password"}
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                    />
                    <button
                      type="button"
                      className="icon-btn eye"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label>Confirm new password</label>
                  <input
                    className="input"
                    type="password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                  />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ justifyContent: "center" }}
                  disabled={resetLoading}
                >
                  {resetLoading ? "Resetting…" : "Reset password"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Use another email
                </button>
              </form>
            </>
          )}

          <div className="login-footer">
            Reset codes expire after 10 minutes. Only the email registered in
            the admin database can receive a reset OTP.
          </div>
        </div>
      </section>

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
