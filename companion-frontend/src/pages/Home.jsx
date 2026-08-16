import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("candor-profile-pic") || null);
  const [name, setName] = useState(() => localStorage.getItem("candor-name") || "Lerato");
  const fileRef = useRef(null);

  useEffect(() => {
    if (!token) navigate("/login", { state: { from: "/home" }, replace: true });
  }, [token, navigate]);

  useEffect(() => {
    if (profilePic) localStorage.setItem("candor-profile-pic", profilePic);
  }, [profilePic]);

  useEffect(() => {
    if (name) localStorage.setItem("candor-name", name);
  }, [name]);

  // keep guest guide minimal — remove Policyholder / Premium payer entries as requested
  const guestRoles = [
    {
      title: "Policyholder",
      points: [
        "Owns the policy and can approve changes.",
        "Pays premiums and decides on beneficiaries.",
      ],
    },
    {
      title: "Premium payer",
      points: [
        "May be a different person from the policyholder.",
        "Covers the premium payments for the policy.",
      ],
    },
    {
      title: "Insured life",
      points: [
        "Is the person whose life supports the cover.",
        "Claims are based on this life being insured.",
      ],
    },
    {
      title: "Beneficiary",
      points: [
        "Receives benefit when the insured life passes away.",
        "Can be changed by the policyholder at any time.",
      ],
    },
  ];

  return (
    <div className="home-page">
      <div className="logo-bar">
        <div className="wrap">
          <Logo />
        </div>
      </div>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-top">
            <div>
              <h1>Hello, {name}</h1>
              <p>Welcome to Candor</p>
            </div>

            <div className="hero-actions">
              <button className="theme-toggle" onClick={toggleTheme}>
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>

              <input type="file" accept="image/*" ref={fileRef} style={{ display: "none" }} onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => setProfilePic(reader.result);
                reader.readAsDataURL(f);
              }} />

              <div className="avatar" onClick={() => fileRef.current?.click()} style={{ cursor: "pointer" }}>
                {profilePic ? <img src={profilePic} alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%" }} /> : <div style={{ width: 36, height: 36 }}>m</div>}
              </div>
            </div>
          </div>

          <div className="tabs">
            <button className="tab active">
              <span className="icon-m">C</span>
              Candor
            </button>

            <button className="tab inactive">
              <span className="icon-m">M</span>
              Multiply
            </button>
          </div>
        </div>
      </section>

      <main className="content">
        <div className="wrap">
          <div className="feedback-card">
            <span>Guest access is available for policy basics and role guidance.</span>
            <a className="feedback-btn" href="/register">
              Create account
            </a>
          </div>

          <div className="section-label">
            <span className="bar"></span>
            <span>PUBLIC GUIDE</span>
          </div>

          <div className="guest-grid">
            {guestRoles.map((role) => (
              <div className="guest-card" key={role.title}>
                <h3>{role.title}</h3>
                <ul>
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="section-label section-space">
            <span className="bar"></span>
            <span>HEALTHCARE</span>
          </div>

          <div className="cards-grid">
            <div className="policy-card">
              <h3>Medical Scheme</h3>
              <div className="row">
                <span className="label">Benefit Option</span>
                <span className="value">Custom</span>
              </div>
              <div className="row">
                <span className="label">Membership number</span>
                <span className="value">1234567890</span>
              </div>
            </div>

            <div className="policy-card">
              <h3>Multiply</h3>
              <div className="row">
                <span className="label">MM-124211527</span>
                <span className="value">Custom</span>
              </div>
              <div className="row">
                <span className="label">Option</span>
                <span className="value">Multiply Instant</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <a href="/chat" className="fab">
        <div className="fab-inner">m</div>
      </a>
    </div>
  );
}

export default Home;
