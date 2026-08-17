import { useState } from "react";
import { register as registerUser } from "../services/authService";
import "../styles/register.css";

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();

const STEP_FORM = "form";
const STEP_CAPTCHA = "captcha";
const STEP_EMAIL_SENT = "email_sent";
const STEP_EMAIL_CODE = "email_code";
const STEP_DONE = "done";

export default function Register() {
  const [citizen, setCitizen] = useState("SA");
  const [step, setStep] = useState(STEP_FORM);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    id_number: "",
    passport_number: "",
    country_of_issue: "",
    date_of_birth: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!formData.first_name.trim()) errs.first_name = "Required";
    if (!formData.last_name.trim()) errs.last_name = "Required";
    if (citizen === "SA") {
      if (!/^\d{13}$/.test(formData.id_number))
        errs.id_number = "SA ID must be exactly 13 digits";
    } else {
      if (!formData.passport_number.trim()) errs.passport_number = "Required";
      if (!formData.country_of_issue) errs.country_of_issue = "Select a country";
    }
    if (!formData.date_of_birth) errs.date_of_birth = "Required";
    if (!formData.phone.trim()) errs.phone = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Valid email required";
    if (!formData.username.trim()) errs.username = "Required";
    if (formData.password.length < 8) errs.password = "At least 8 characters";
    if (formData.password !== formData.confirm_password)
      errs.confirm_password = "Passwords do not match";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setStep(STEP_CAPTCHA);
  }

  async function handleCaptchaVerify() {
    if (!captchaChecked) return;
    setSubmitting(true);
    setServerError("");
    try {
      await registerUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        ...(citizen === "SA"
          ? { id_number: formData.id_number }
          : { passport_number: formData.passport_number, country_of_issue: formData.country_of_issue }),
        date_of_birth: formData.date_of_birth,
        phone: formData.phone,
      });
      setStep(STEP_EMAIL_SENT);
    } catch (err) {
      setServerError(err.message || "Registration failed. Please try again.");
      setStep(STEP_FORM);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCodeVerify(e) {
    e.preventDefault();
    // Simulate code check — accept any 6-digit code for now
    if (!/^\d{6}$/.test(emailCode)) {
      setCodeError("Please enter the 6-digit code sent to your email.");
      return;
    }
    setStep(STEP_DONE);
  }

  // ── CAPTCHA overlay ──────────────────────────────────────────────────────────
  if (step === STEP_CAPTCHA) {
    return (
      <div className="register-page">
        <div className="reg-overlay-wrap">
          <div className="captcha-card">
            <div className="captcha-spinner-wrap">
              <div className="captcha-spinner" />
            </div>
            <p className="captcha-label">Verifying your information…</p>
            <div className="captcha-box">
              <label className="captcha-checkbox-label">
                <input
                  type="checkbox"
                  checked={captchaChecked}
                  onChange={(e) => setCaptchaChecked(e.target.checked)}
                />
                <span>I&apos;m not a robot</span>
              </label>
              <div className="captcha-logo">
                <div className="captcha-rc-logo">reCAPTCHA</div>
                <div className="captcha-rc-sub">Privacy · Terms</div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleCaptchaVerify}
              disabled={!captchaChecked || submitting}
            >
              {submitting ? "Processing…" : "Verify & Continue"}
            </button>
            {serverError && <p className="field-error" style={{ marginTop: 12 }}>{serverError}</p>}
          </div>
        </div>
      </div>
    );
  }

  // ── Email sent notice ────────────────────────────────────────────────────────
  if (step === STEP_EMAIL_SENT) {
    return (
      <div className="register-page">
        <div className="wrap">
          <div className="card success-screen">
            <div className="check">✉</div>
            <h2>Check your email</h2>
            <p>
              We sent a 6-digit verification code to <strong>{formData.email}</strong>.
              Please enter it below to activate your account.
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 8 }}
              onClick={() => setStep(STEP_EMAIL_CODE)}
            >
              Enter code
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Email code entry ─────────────────────────────────────────────────────────
  if (step === STEP_EMAIL_CODE) {
    return (
      <div className="register-page">
        <div className="wrap">
          <div className="card" style={{ padding: "32px 26px" }}>
            <h2 style={{ marginBottom: 8, fontSize: 22 }}>Enter verification code</h2>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
              A 6-digit code was sent to <strong>{formData.email}</strong>.
            </p>
            <form onSubmit={handleCodeVerify}>
              <div className="field">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  name="email_code"
                  value={emailCode}
                  onChange={(e) => { setEmailCode(e.target.value.replace(/\D/g, "")); setCodeError(""); }}
                  placeholder=" "
                  autoComplete="one-time-code"
                />
                <label>6-digit code</label>
              </div>
              {codeError && <p className="field-error">{codeError}</p>}
              <button className="btn btn-primary" type="submit">Verify</button>
            </form>
            <button
              className="cancel-link"
              type="button"
              onClick={() => setStep(STEP_EMAIL_SENT)}
              style={{ marginTop: 14, background: "none", border: "none", cursor: "pointer" }}
            >
              Resend code
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  if (step === STEP_DONE) {
    return (
      <div className="register-page">
        <div className="wrap">
          <div className="card success-screen">
            <div className="check">✓</div>
            <h2>Account verified</h2>
            <p>Your account is ready. You can now log in with your new credentials.</p>
            <button className="btn btn-primary" onClick={() => window.location.href = "/login"}>
              Continue to log in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ────────────────────────────────────────────────────────
  return (
    <div className="register-page">
      <div className="topbar">
        <a href="/">← Back</a>
      </div>

      <div className="wrap">
        <div className="reg-brand">
          <span className="brand-medi">Medi</span><span className="brand-care">Care</span>
        </div>

        <h1>Create account</h1>
        <p className="subtitle">We will verify your details before activating your account.</p>

        {serverError && <p className="field-error global-error">{serverError}</p>}

        <div className="card">
          <div className="tabs">
            <div className={`tab ${citizen === "SA" ? "active" : ""}`} onClick={() => setCitizen("SA")}>
              SA Citizen
            </div>
            <div className={`tab ${citizen === "NON-SA" ? "active" : ""}`} onClick={() => setCitizen("NON-SA")}>
              Non-SA Citizen
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="field">
              <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder=" " />
              <label>First name</label>
              {fieldErrors.first_name && <span className="field-error">{fieldErrors.first_name}</span>}
            </div>

            <div className="field">
              <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder=" " />
              <label>Surname</label>
              {fieldErrors.last_name && <span className="field-error">{fieldErrors.last_name}</span>}
            </div>

            {/* ID / Passport */}
            {citizen === "SA" ? (
              <div className="field">
                <input
                  name="id_number"
                  value={formData.id_number}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 13);
                    setFormData((p) => ({ ...p, id_number: v }));
                    setFieldErrors((p) => ({ ...p, id_number: "" }));
                  }}
                  inputMode="numeric"
                  maxLength={13}
                  placeholder=" "
                />
                <label>SA ID number (13 digits)</label>
                {fieldErrors.id_number && <span className="field-error">{fieldErrors.id_number}</span>}
              </div>
            ) : (
              <>
                <div className="field">
                  <input name="passport_number" value={formData.passport_number} onChange={handleChange} placeholder=" " />
                  <label>Passport number</label>
                  {fieldErrors.passport_number && <span className="field-error">{fieldErrors.passport_number}</span>}
                </div>

                <div className="field select-field">
                  <label>Country of issue</label>
                  <select
                    name="country_of_issue"
                    value={formData.country_of_issue}
                    onChange={handleChange}
                  >
                    <option value="">Select country</option>
                    {ALL_COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {fieldErrors.country_of_issue && <span className="field-error">{fieldErrors.country_of_issue}</span>}
                </div>
              </>
            )}

            {/* Date of birth */}
            <div className="field">
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Date of birth</label>
              {fieldErrors.date_of_birth && <span className="field-error">{fieldErrors.date_of_birth}</span>}
            </div>

            {/* Phone — plain field for SA, no country-code dropdown */}
            <div className="field">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
                inputMode="tel"
              />
              <label>{citizen === "SA" ? "Cell phone number" : "Phone number"}</label>
              {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
            </div>

            {/* Email */}
            <div className="field">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " />
              <label>Email address</label>
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            {/* Username */}
            <div className="field">
              <input name="username" value={formData.username} onChange={handleChange} placeholder=" " />
              <label>Username</label>
              {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
            </div>

            {/* Password */}
            <div className="field">
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder=" " />
              <label>Password</label>
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>

            <div className="field">
              <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder=" " />
              <label>Confirm password</label>
              {fieldErrors.confirm_password && <span className="field-error">{fieldErrors.confirm_password}</span>}
            </div>

            <button className="btn btn-primary" type="submit">Continue</button>
          </form>

          <a href="/" className="cancel-link">Cancel</a>
        </div>

        <div className="legal">
          An authorised financial services and registered credit provider.
          <br />©2026 MediCare Limited.<br />
          <a href="#">Legal and Compliance</a>{" | "}
          <a href="#">Terms and Conditions</a>
        </div>
      </div>
    </div>
  );
}
