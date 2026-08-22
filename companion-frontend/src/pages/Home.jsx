import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

const ROLE_LABELS = ["Policyholder", "Insured life", "Beneficiary", "Premium payer"];

const ACTIVE_POLICIES = [
  { id: 1, type: "Medical aid", plan: "Essential Smart", number: "MS-8821043", status: "Active", premium: "R 1 245 / mo", next: "1 Sep 2026", cover: "R 250 000" },
  { id: 2, type: "Life cover", plan: "LifeGuard Plus", number: "LC-3340187", status: "Active", premium: "R 620 / mo", next: "1 Sep 2026", cover: "R 1 500 000" },
];

const POLICY_CATALOGUE = [
  { id: "medical", type: "Medical aid", plan: "Essential Smart", description: "Comprehensive day-to-day and hospital cover including GP visits, chronic medication, emergency room care, and specialist referrals.", premium: "From R 645 / mo", benefits: ["GP consultations", "Chronic medication", "Emergency cover", "Specialist referrals"], img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "life", type: "Life cover", plan: "LifeGuard Plus", description: "Lump-sum benefit paid to your beneficiaries on death. Cover adjusts with inflation and includes a terminal illness accelerator.", premium: "From R 310 / mo", benefits: ["Death benefit", "Terminal illness payout", "Inflation-linked cover", "Beneficiary nomination"], img: "https://images.unsplash.com/photo-1529518152792-d08317b26e22?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "car", type: "Car insurance", plan: "DriveSecure Comprehensive", description: "Comprehensive vehicle cover for accident damage, theft, third-party liability, and roadside assistance with cashback for claim-free years.", premium: "From R 480 / mo", benefits: ["Accident damage", "Theft & hijacking", "Third-party liability", "Roadside assistance"], img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "home", type: "Home insurance", plan: "HomeShield", description: "Covers your home structure and contents against fire, flooding, theft, and accidental damage. Optional all-risk cover for valuables.", premium: "From R 290 / mo", benefits: ["Structure cover", "Contents cover", "Flood & fire", "All-risk valuables"], img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "funeral", type: "Funeral cover", plan: "FamilyCare Funeral", description: "Pays out within 24 hours to cover funeral costs for you and your extended family. No medical examination required.", premium: "From R 95 / mo", benefits: ["24-hour payout", "Extended family cover", "No medical exam", "Repatriation benefit"], img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "disability", type: "Disability cover", plan: "AbilityGuard", description: "Monthly income replacement if you cannot work due to illness or injury. Covers both temporary and permanent disability.", premium: "From R 220 / mo", benefits: ["Income replacement", "Temporary disability", "Permanent disability", "Rehabilitation support"], img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=300&fit=crop&auto=format&q=70" },
];

const NOTIFICATIONS = [
  { id: 1, text: "Your renewal quote for Essential Smart is ready.", time: "2h ago", unread: true },
  { id: 2, text: "Premium payment of R1 245 confirmed.", time: "Yesterday", unread: false },
  { id: 3, text: "New benefit: free dental check-up included from Sep 2026.", time: "3d ago", unread: false },
];

const CLAIMS = [
  { id: 1, type: "Medical aid", ref: "CLM-20260812", status: "In progress", date: "12 Aug 2026", amount: "R 3 200" },
  { id: 2, type: "Medical aid", ref: "CLM-20260703", status: "Paid", date: "3 Jul 2026", amount: "R 850" },
];

const DOCS = [
  { name: "Policy schedule — Essential Smart", date: "Issued 1 Jan 2026" },
  { name: "Policy schedule — LifeGuard Plus", date: "Issued 1 Jan 2026" },
  { name: "Benefit statement 2025", date: "Issued 28 Feb 2026" },
  { name: "Tax certificate 2025", date: "Issued 28 Feb 2026" },
];

// ── Nav defined OUTSIDE Home so it never remounts on view changes ─────────────
function HomeNav({ onBack, onGoHome, onViewNotif, darkMode, toggleTheme,
  profilePic, initials, unreadCount, menuOpen, setMenuOpen, fileRef, onPickPhoto, onLogout }) {
  return (
    <header className="hp-nav">
      <div className="hp-nav-inner">
        <button className="hp-brand-btn" onClick={onGoHome}>Medi<span>Care</span></button>
        <div className="hp-nav-right">
          {onBack && <button className="hp-back-btn" onClick={onBack}>← Back</button>}
          <button className="hp-theme-btn" onClick={toggleTheme}>{darkMode ? "Light" : "Dark"}</button>
          <input type="file" accept="image/*" ref={fileRef} style={{ display: "none" }} onChange={onPickPhoto} />
          <button className="hp-notif-btn" onClick={onViewNotif} aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="hp-notif-badge">{unreadCount}</span>}
          </button>
          <button className="hp-avatar" onClick={() => setMenuOpen(o => !o)} aria-label="Account menu">
            {profilePic ? <img src={profilePic} alt="avatar" /> : <span>{initials}</span>}
          </button>
          {menuOpen && (
            <div className="hp-avatar-menu">
              <button onClick={() => { fileRef.current?.click(); setMenuOpen(false); }}>Change photo</button>
              <button onClick={() => { onViewNotif(); setMenuOpen(false); }}>Notifications</button>
              <button className="hp-logout" onClick={onLogout}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("mc-profile-pic") || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef(null);

  // Drive view from URL query param so browser back/forward works
  const params = new URLSearchParams(location.search);
  const view = params.get("view") || "home";

  function setView(v) {
    if (v === "home") {
      navigate("/home", { replace: false });
    } else {
      navigate(`/home?view=${v}`);
    }
  }

  const displayName = user?.first_name || user?.username || "Member";
  const initials = displayName !== "Member" ? displayName.slice(0, 2).toUpperCase() : "MC";
  const userRole = user?.role && ROLE_LABELS.includes(user.role) ? user.role : "Policyholder";
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  function pickPhoto(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { setProfilePic(reader.result); localStorage.setItem("mc-profile-pic", reader.result); };
    reader.readAsDataURL(f);
  }

  const navProps = {
    onGoHome: () => setView("home"),
    onViewNotif: () => setView("notifications"),
    darkMode, toggleTheme, profilePic, initials, unreadCount,
    menuOpen, setMenuOpen, fileRef,
    onPickPhoto: pickPhoto,
    onLogout: () => navigate("/"),
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  if (view === "notifications") {
    return (
      <div className="hp">
        <HomeNav {...navProps} onBack={() => setView("home")} />
        <main className="hp-main">
          <div className="hp-wrap">
            <div className="hp-page-title">
              <h1>Notifications</h1>
              {unreadCount > 0 && <span className="hp-count-pill">{unreadCount} new</span>}
            </div>
            <div className="hp-notif-list">
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`hp-notif ${n.unread ? "hp-notif-unread" : ""}`}>
                  <div className="hp-notif-dot-side" />
                  <div className="hp-notif-body">
                    <p>{n.text}</p>
                    <span>{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Add / browse policies ─────────────────────────────────────────────────
  if (view === "add-policy") {
    return (
      <div className="hp">
        <HomeNav {...navProps} onBack={() => setView("home")} />
        <main className="hp-main">
          <div className="hp-wrap">
            <div className="hp-page-title">
              <h1>Available policies</h1>
              <p>Browse plans and ask Candor for personalised advice on any product.</p>
            </div>
            <div className="hp-catalogue-grid">
              {POLICY_CATALOGUE.map(p => (
                <div key={p.id} className="hp-cat-card">
                  <div className="hp-cat-img">
                    <img src={p.img} alt={p.type} />
                    <span className="hp-cat-type-badge">{p.type}</span>
                  </div>
                  <div className="hp-cat-body">
                    <h3>{p.plan}</h3>
                    <p className="hp-cat-desc">{p.description}</p>
                    <ul className="hp-cat-benefits">
                      {p.benefits.map(b => <li key={b}>{b}</li>)}
                    </ul>
                    <div className="hp-cat-footer">
                      <span className="hp-cat-price">{p.premium}</span>
                      <button className="hp-btn-primary" onClick={() => navigate("/chat")}>Ask Candor</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Home dashboard ────────────────────────────────────────────────────────
  return (
    <div className="hp">
      <HomeNav {...navProps} />

      <div className="hp-profile-header">
        <div className="hp-wrap hp-profile-inner">
          <div className="hp-profile-left">
            <div className="hp-profile-avatar-wrap">
              <div className="hp-profile-avatar">
                {profilePic ? <img src={profilePic} alt="Profile" /> : <span>{initials}</span>}
              </div>
              <button className="hp-profile-photo-btn" onClick={() => fileRef.current?.click()} aria-label="Change photo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>
            <div className="hp-profile-info">
              <p className="hp-profile-welcome">Welcome, {displayName}<span className="hp-red-dot">.</span></p>
              <div className="hp-profile-meta">
                <span className="hp-role-pill">{userRole}</span>
              </div>
              <div className="hp-profile-details">
                <span className="hp-profile-id">MCR-2026-00291</span>
                <span className="hp-profile-sep">·</span>
                <span className="hp-profile-since">Member since Jan 2024</span>
              </div>
            </div>
          </div>
          <div className="hp-profile-stats">
            <div className="hp-stat">
              <span className="hp-stat-num">{ACTIVE_POLICIES.length}</span>
              <span className="hp-stat-label">Active policies</span>
            </div>
            <div className="hp-stat-divider" />
            <div className="hp-stat">
              <span className="hp-stat-num">R 1 865</span>
              <span className="hp-stat-label">Monthly premium</span>
            </div>
            <div className="hp-stat-divider" />
            <div className="hp-stat">
              <span className="hp-stat-num">2</span>
              <span className="hp-stat-label">Claims this year</span>
            </div>
          </div>
        </div>
      </div>

      <main className="hp-main">
        <div className="hp-wrap">

          <div className="hp-actions-row">
            <button className="hp-action-btn" onClick={() => navigate("/quote")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              Get a quote
            </button>
            <button className="hp-action-btn" onClick={() => setView("add-policy")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
              Add policy
            </button>
            <button className="hp-action-btn" onClick={() => navigate("/chat")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              Ask Candor
            </button>
            <button className="hp-action-btn" onClick={() => setView("notifications")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              Notifications
              {unreadCount > 0 && <span className="hp-action-dot" />}
            </button>
          </div>

          <section className="hp-section">
            <div className="hp-section-head">
              <div className="hp-section-bar" />
              <h2>My policies</h2>
              <button className="hp-link-btn" onClick={() => setView("add-policy")}>+ Add policy</button>
            </div>
            <div className="hp-policy-grid">
              {ACTIVE_POLICIES.map(p => (
                <div key={p.id} className="hp-policy-card">
                  <div className="hp-policy-top">
                    <div>
                      <span className="hp-policy-type">{p.type}</span>
                      <h3 className="hp-policy-name">{p.plan}</h3>
                    </div>
                    <span className="hp-status-pill">{p.status}</span>
                  </div>
                  <div className="hp-policy-rows">
                    <div className="hp-policy-row"><span>Policy number</span><span>{p.number}</span></div>
                    <div className="hp-policy-row"><span>Cover amount</span><span className="hp-policy-val">{p.cover}</span></div>
                    <div className="hp-policy-row"><span>Monthly premium</span><span className="hp-policy-val">{p.premium}</span></div>
                    <div className="hp-policy-row"><span>Next payment</span><span>{p.next}</span></div>
                  </div>
                  <div className="hp-policy-actions">
                    <button className="hp-btn-outline" onClick={() => navigate("/chat")}>Ask Candor</button>
                    <button className="hp-btn-ghost">View details</button>
                  </div>
                </div>
              ))}
              <div className="hp-policy-card hp-policy-cta" onClick={() => setView("add-policy")}>
                <div className="hp-cta-plus">+</div>
                <p>Add a policy</p>
                <span>Browse available plans</span>
              </div>
            </div>
          </section>

          <section className="hp-section">
            <div className="hp-section-head">
              <div className="hp-section-bar" />
              <h2>Recent claims</h2>
              <button className="hp-link-btn" onClick={() => navigate("/chat")}>Submit a claim</button>
            </div>
            <div className="hp-claims-table">
              <div className="hp-claims-head">
                <span>Type</span><span>Reference</span><span>Date</span><span>Amount</span><span>Status</span>
              </div>
              {CLAIMS.map(c => (
                <div key={c.id} className="hp-claims-row">
                  <span>{c.type}</span>
                  <span className="hp-claims-ref">{c.ref}</span>
                  <span>{c.date}</span>
                  <span className="hp-claims-amount">{c.amount}</span>
                  <span className={`hp-claims-status ${c.status === "Paid" ? "paid" : "progress"}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="hp-section">
            <div className="hp-section-head">
              <div className="hp-section-bar" />
              <h2>Your benefits</h2>
            </div>
            <div className="hp-benefits-grid">
              <div className="hp-benefit-card">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&auto=format&q=70" alt="Wellness" />
                <div className="hp-benefit-body">
                  <h4>Wellness rewards</h4>
                  <p>Earn points for gym visits, health checks, and healthy habits.</p>
                  <button className="hp-benefit-link" onClick={() => navigate("/chat")}>Learn more</button>
                </div>
              </div>
              <div className="hp-benefit-card">
                <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&auto=format&q=70" alt="Telemedicine" />
                <div className="hp-benefit-body">
                  <h4>Telemedicine</h4>
                  <p>Consult a doctor 24/7 via video or phone at no extra cost.</p>
                  <button className="hp-benefit-link" onClick={() => navigate("/chat")}>Book now</button>
                </div>
              </div>
              <div className="hp-benefit-card">
                <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&auto=format&q=70" alt="Cashback" />
                <div className="hp-benefit-body">
                  <h4>Premium cashback</h4>
                  <p>Get up to 30% of your premiums back for claim-free years.</p>
                  <button className="hp-benefit-link" onClick={() => navigate("/chat")}>View details</button>
                </div>
              </div>
            </div>
          </section>

          <section className="hp-section">
            <div className="hp-section-head">
              <div className="hp-section-bar" />
              <h2>Documents</h2>
            </div>
            <div className="hp-docs-list">
              {DOCS.map(d => (
                <div key={d.name} className="hp-doc-row">
                  <div className="hp-doc-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <div className="hp-doc-info">
                    <span>{d.name}</span>
                    <span>{d.date}</span>
                  </div>
                  <button className="hp-doc-download" aria-label="Download">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <button className="hp-fab" onClick={() => navigate("/chat")} aria-label="Ask Candor">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Ask Candor</span>
      </button>
    </div>
  );
}
