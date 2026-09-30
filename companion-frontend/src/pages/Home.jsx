import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";
import { apiFetch } from "../services/api";

const ROLE_LABELS = ["Policyholder", "Insured life", "Beneficiary", "Premium payer"];

const DEFAULT_POLICIES = [
  { id: 1, catalogueId: "medical", type: "Medical aid", plan: "Essential Smart", number: "MS-8821043", status: "Active", premium: "R 1 245 / mo", monthlyAmount: 1245, next: "1 Sep 2026", cover: "R 250 000", isDefault: true },
  { id: 2, catalogueId: "life", type: "Life cover", plan: "LifeGuard Plus", number: "LC-3340187", status: "Active", premium: "R 620 / mo", monthlyAmount: 620, next: "1 Sep 2026", cover: "R 1 500 000", isDefault: true },
];

const CLAIM_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CLAIM_TYPES = [
  { value: 'LIFE_COVER', label: 'Life cover claim' },
  { value: 'FUNERAL_COVER', label: 'Funeral cover claim' },
  { value: 'OTHER_DEATH_BENEFIT', label: 'Other death benefit claim' },
];

const PASSPORT_COUNTRIES = [
  'South Africa', 'Angola', 'Botswana', 'Democratic Republic of the Congo', 'Eswatini',
  'Lesotho', 'Malawi', 'Mozambique', 'Namibia', 'Nigeria', 'Rwanda', 'Tanzania',
  'Uganda', 'United Kingdom', 'United States', 'Zambia', 'Zimbabwe', 'Australia',
  'Bangladesh', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'India', 'Japan',
  'Pakistan', 'Portugal', 'Somalia', 'South Korea', 'Spain', 'United Arab Emirates',
];

const CLAIMS = [
  { id: 1, type: "Medical aid", ref: "CLM-20260812", status: "In progress", date: "12 Aug 2026", amount: "R 3 200" },
  { id: 2, type: "Medical aid", ref: "CLM-20260703", status: "Paid", date: "3 Jul 2026", amount: "R 850" },
];

const POLICY_LIST_STORAGE_KEY = "candor_added_policy_catalogue_items";

const POLICY_CATALOGUE = [
  { id: "medical", type: "Medical aid", plan: "Essential Smart", description: "Comprehensive day-to-day and hospital cover including GP visits, chronic medication, emergency room care, and specialist referrals.", premium: "From R 645 / mo", benefits: ["GP consultations", "Chronic medication", "Emergency cover", "Specialist referrals"], img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "life", type: "Life cover", plan: "LifeGuard Plus", description: "Lump-sum benefit paid to your beneficiaries on death. Cover adjusts with inflation and includes a terminal illness accelerator.", premium: "From R 310 / mo", benefits: ["Death benefit", "Terminal illness payout", "Inflation-linked cover", "Beneficiary nomination"], img: "https://images.unsplash.com/photo-1529518152792-d08317b26e22?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "car", type: "Car insurance", plan: "DriveSecure Comprehensive", description: "Comprehensive vehicle cover for accident damage, theft, third-party liability, and roadside assistance with cashback for claim-free years.", premium: "From R 480 / mo", benefits: ["Accident damage", "Theft & hijacking", "Third-party liability", "Roadside assistance"], img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "home", type: "Home insurance", plan: "HomeShield", description: "Covers your home structure and contents against fire, flooding, theft, and accidental damage. Optional all-risk cover for valuables.", premium: "From R 290 / mo", benefits: ["Structure cover", "Contents cover", "Flood & fire", "All-risk valuables"], img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "funeral", type: "Funeral cover", plan: "FamilyCare Funeral", description: "Pays out within 24 hours to cover funeral costs for you and your extended family. No medical examination required.", premium: "From R 95 / mo", benefits: ["24-hour payout", "Extended family cover", "No medical exam", "Repatriation benefit"], img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop&auto=format&q=70" },
  { id: "disability", type: "Disability cover", plan: "AbilityGuard", description: "Monthly income replacement if you cannot work due to illness or injury. Covers both temporary and permanent disability.", premium: "From R 220 / mo", benefits: ["Income replacement", "Temporary disability", "Permanent disability", "Rehabilitation support"], img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=300&fit=crop&auto=format&q=70" },
];


const POLICY_MONTHLY_AMOUNTS = {
  medical: 645,
  life: 310,
  car: 480,
  home: 290,
  funeral: 95,
  disability: 220,
};

function makeSavedPolicy(catalogueId, savedAt, listReference) {
  const product = POLICY_CATALOGUE.find(item => item.id === catalogueId);
  if (!product) return null;
  return {
    ...product,
    catalogueId,
    id: `saved-${catalogueId}`,
    listReference: listReference || `LIST-${catalogueId.toUpperCase()}`,
    addedDate: new Date(savedAt || Date.now()).toLocaleDateString(),
    monthlyAmount: POLICY_MONTHLY_AMOUNTS[catalogueId] || 0,
    status: "In your list",
    isDefault: false,
  };
}

function readSavedCatalogueEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(POLICY_LIST_STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.map(entry => typeof entry === "string"
      ? { catalogueId: entry }
      : entry && typeof entry.catalogueId === "string" ? entry : null
    ).filter(Boolean);
  } catch {
    return [];
  }
}

function readPolicyList() {
  const defaultIds = new Set(DEFAULT_POLICIES.map(policy => policy.catalogueId));
  const savedEntries = readSavedCatalogueEntries()
    .filter(entry => !defaultIds.has(entry.catalogueId))
    .map(entry => makeSavedPolicy(entry.catalogueId, entry.savedAt, entry.listReference))
    .filter(Boolean);
  return [
    ...DEFAULT_POLICIES.map(policy => ({
      ...POLICY_CATALOGUE.find(item => item.id === policy.catalogueId),
      ...policy,
    })),
    ...savedEntries,
  ];
}

const NOTIFICATIONS = [
  { id: 1, text: "Your renewal quote for Essential Smart is ready.", time: "2h ago", unread: true },
  { id: 2, text: "Premium payment of R1 245 confirmed.", time: "Yesterday", unread: false },
  { id: 3, text: "New benefit: free dental check-up included from Sep 2026.", time: "3d ago", unread: false },
];

const DOCS = [
  { name: "Policy schedule — Essential Smart", date: "Issued 1 Jan 2026" },
  { name: "Policy schedule — LifeGuard Plus", date: "Issued 1 Jan 2026" },
  { name: "Benefit statement 2025", date: "Issued 28 Feb 2026" },
  { name: "Tax certificate 2025", date: "Issued 28 Feb 2026" },
];

const BENEFITS = [
  {
    id: "wellness",
    title: "Wellness rewards",
    summary: "Earn points for gym visits, health checks, and healthy habits.",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&auto=format&q=70",
    cta: "Learn more",
    details: [
      "Earn 50 points per gym visit, up to 4 visits per month.",
      "500 bonus points for completing an annual health screening.",
      "Points can be redeemed for premium discounts, fitness gear, or grocery vouchers.",
      "Track your progress in the MediCare member app under Rewards.",
    ],
  },
  {
    id: "telemedicine",
    title: "Telemedicine",
    summary: "Consult a doctor 24/7 via video or phone at no extra cost.",
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&auto=format&q=70",
    cta: "Book now",
    details: [
      "Speak to a GP anytime — no appointment needed.",
      "Includes prescriptions sent directly to your nearest pharmacy.",
      "Available to all Essential Smart and LifeGuard Plus members.",
      "Average wait time is under 8 minutes. Use the member app or call 0800 634 227.",
    ],
  },
  {
    id: "cashback",
    title: "Premium cashback",
    summary: "Get up to 30% of your premiums back for claim-free years.",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&auto=format&q=70",
    cta: "View details",
    details: [
      "After 12 consecutive claim-free months you earn 10% cashback on premiums paid.",
      "This increases by 10% each claim-free year, capped at 30%.",
      "Cashback is paid as a credit on your January premium.",
      "One qualifying claim resets the counter — hospital admissions count, GP visits do not.",
    ],
  },
];

// ── UserAvatar — fits perfectly in its circle, theme-aware ──────────────────
function UserAvatar({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="user-avatar-svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* Background */}
      <circle cx="20" cy="20" r="20" className="avatar-bg" />
      {/* Head — smaller, sits higher */}
      <circle cx="20" cy="14" r="5.5" className="avatar-figure" />
      {/* Shoulders — starts at y=22, peak at y=30, well inside circle */}
      <path d="M8 32 Q8 22 20 22 Q32 22 32 32" className="avatar-figure" />
    </svg>
  );
}
function HomeNav({ onBack, onGoHome, onViewNotif, darkMode, toggleTheme,
  unreadCount, menuOpen, setMenuOpen, onLogout }) {
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen, setMenuOpen]);

  return (
    <header className="hp-nav">
      <div className="hp-nav-inner">
        <button className="hp-brand-btn" onClick={onGoHome}>Medi<span>Care</span><span className="hp-brand-dot">.</span></button>
        <div className="hp-nav-right">
          {onBack && <button className="hp-back-btn" onClick={onBack}>← Back</button>}
          <button className="hp-theme-btn" onClick={toggleTheme}>{darkMode ? "Light" : "Dark"}</button>
          <button className="hp-notif-btn" onClick={onViewNotif} aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="hp-notif-badge">{unreadCount}</span>}
          </button>
          <div ref={menuRef} style={{ position: "relative" }}>
            <button className="hp-avatar hp-avatar-svg" onClick={() => setMenuOpen(o => !o)} aria-label="Account menu">
              <UserAvatar size={34} />
            </button>
            {menuOpen && (
              <div className="hp-avatar-menu">
                <button onClick={() => { onViewNotif(); setMenuOpen(false); }}>Notifications</button>
                <button className="hp-logout" onClick={onLogout}>Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const { user, token, authReady, clearAuth } = useAuth();
  const [claims, setClaims] = useState([]);
  const [todayDate] = useState(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  });
  const [claimsLoading, setClaimsLoading] = useState(true);
  const [claimsError, setClaimsError] = useState("");
  const [claimFormOpen, setClaimFormOpen] = useState(false);
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimNotice, setClaimNotice] = useState("");
  const [claimForm, setClaimForm] = useState({
    claim_type: 'LIFE_COVER',
    claimant_name: "",
    claimant_relationship: "",
    deceased_name: "",
    deceased_document_type: 'ID',
    deceased_id_number: "",
    passport_country: "",
    date_of_death: "",
    notes: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [benefitModal, setBenefitModal] = useState(null);
  const [policyDetails, setPolicyDetails] = useState(null);
  const [myPolicies, setMyPolicies] = useState(readPolicyList);
  const [policyNotice, setPolicyNotice] = useState("");
  const [addingPolicyId, setAddingPolicyId] = useState(null);

  const params = new URLSearchParams(location.search);
  const view = params.get("view") || "home";

  useEffect(() => {
    if (authReady && !token) navigate("/login", { state: { from: "/home" }, replace: true });
  }, [token, authReady, navigate]);

  useEffect(() => {
    if (!authReady || !token) return undefined;
    let cancelled = false;
    apiFetch("/api/claims")
      .then(data => {
        if (!cancelled) {
          setClaims(Array.isArray(data.claims) ? data.claims : []);
          setClaimsError("");
        }
      })
      .catch(error => {
        if (!cancelled) setClaimsError(error.message || "Could not load your claims.");
      })
      .finally(() => {
        if (!cancelled) setClaimsLoading(false);
      });
    return () => { cancelled = true; };
  }, [authReady, token]);

  function openClaimForm() {
    const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
    setClaimForm(current => ({ ...current, claimant_name: current.claimant_name || name }));
    setClaimError("");
    setClaimNotice("");
    setClaimFormOpen(true);
  }

  async function submitClaim(event) {
    event.preventDefault();
    setClaimSubmitting(true);
    setClaimError("");
    try {
      const data = await apiFetch("/api/claims", {
        method: "POST",
        body: JSON.stringify(claimForm),
      });
      if (data.claim) setClaims(current => [data.claim, ...current.filter(item => item.id !== data.claim.id)]);
      setClaimsError("");
      setClaimNotice(data.message || "Your claim has been submitted.");
      setClaimForm({ claim_type: 'LIFE_COVER', claimant_name: "", claimant_relationship: "", deceased_name: "", deceased_document_type: 'ID', deceased_id_number: "", passport_country: "", date_of_death: "", notes: "" });
      setClaimFormOpen(false);
    } catch (error) {
      setClaimError(error.message || "We could not submit your claim. Please try again.");
    } finally {
      setClaimSubmitting(false);
    }
  }


  function setView(v) {
    if (v === "home") navigate("/home", { replace: false });
    else navigate(`/home?view=${v}`);
  }

  async function handleAddPolicy(product) {
    setAddingPolicyId(product.id);
    setPolicyNotice("");
    try {
      const savedEntries = readSavedCatalogueEntries();
      const isAlreadyListed = myPolicies.some(item => item.catalogueId === product.id);
      if (!isAlreadyListed) {
        const savedAt = new Date().toISOString();
        const entry = makeSavedPolicy(product.id, savedAt);
        localStorage.setItem(POLICY_LIST_STORAGE_KEY, JSON.stringify([
          ...savedEntries.filter(item => item.catalogueId !== product.id),
          { catalogueId: product.id, savedAt, listReference: entry?.listReference },
        ]));
        if (entry) setMyPolicies(current => [...current, entry]);
        setPolicyNotice(`${product.plan} was added to My policies.`);
      } else {
        setPolicyNotice(`${product.plan} is already in My policies.`);
      }
    } catch {
      setPolicyNotice("Your browser could not save this policy to the list. Check browser storage and try again.");
    } finally {
      setAddingPolicyId(null);
    }
  }

  const displayName = user?.first_name || user?.username || "Member";
  const userRole = user?.role && ROLE_LABELS.includes(user.role) ? user.role : "Policyholder";
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
  const recentClaims = [
    ...claims.map(claim => {
      const status = (claim.status || "CLAIM_SUBMITTED_PENDING_REVIEW").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
      const dateValue = claim.created_at || claim.date_of_death;
      const dateParts = dateValue ? String(dateValue).match(/^(\d{4})-(\d{2})-(\d{2})/) : null;
      const displayedDate = dateParts
        ? `${Number(dateParts[3])} ${CLAIM_MONTH_NAMES[Number(dateParts[2]) - 1]} ${dateParts[1]}`
        : '—';
      return {
        key: `claim-${claim.id}`,
        type: CLAIM_TYPES.find(type => type.value === claim.claim_type)?.label || 'Death benefit claim',
        ref: `CLM-${String(claim.id).padStart(6, "0")}`,
        date: displayedDate,
        amount: "To be assessed",
        status,
        paid: ["PAID", "APPROVED"].includes((claim.status || "").toUpperCase()),
      };
    }),
    ...CLAIMS.map(claim => ({ ...claim, key: `default-${claim.id}`, paid: claim.status === "Paid" })),
  ];

  const navProps = {
    onGoHome: () => setView("home"),
    onViewNotif: () => setView("notifications"),
    darkMode, toggleTheme, unreadCount,
    menuOpen, setMenuOpen,
    onLogout: () => { clearAuth(); navigate("/", { replace: true }); },
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
              <p>Save products to your list or ask Candor for guidance. These sample plans are not active insurance cover.</p>
            </div>
            {policyNotice && <p className="hp-policy-notice" role="status">{policyNotice}</p>}
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
                    <div className="hp-cat-price">{p.premium}</div>
                    <div className="hp-cat-footer">
                      <button
                        className="hp-btn-primary"
                        onClick={() => handleAddPolicy(p)}
                        disabled={addingPolicyId === p.id || myPolicies.some(item => item.catalogueId === p.id)}
                      >
                        {myPolicies.some(item => item.catalogueId === p.id)
                          ? "Added to My policies"
                          : addingPolicyId === p.id ? "Adding…" : "Add to My policies"}
                      </button>
                      <button className="hp-btn-outline" onClick={() =>
                        navigate("/chat", { state: { catalogueCard: p } })
                      }>Ask Candor</button>
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
                <UserAvatar size={48} />
              </div>
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
              <span className="hp-stat-num">{myPolicies.length}</span>
              <span className="hp-stat-label">Policies and saved plans</span>
            </div>
            <div className="hp-stat-divider" />
            <div className="hp-stat">
              <span className="hp-stat-num">R {myPolicies.filter(policy => policy.isDefault).reduce((total, policy) => total + policy.monthlyAmount, 0).toLocaleString("en-ZA")}</span>
              <span className="hp-stat-label">Active monthly premium</span>
            </div>
            <div className="hp-stat-divider" />
            <div className="hp-stat">
              <span className="hp-stat-num">{recentClaims.length}</span>
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
            {myPolicies.length === 0 ? (
              <div className="hp-policy-empty">
                <p>You have not added any products to your policy list yet.</p>
                <button className="hp-btn-primary" onClick={() => setView("add-policy")}>Browse available policies</button>
              </div>
            ) : (
              <div className="hp-policy-grid">
                {myPolicies.map(p => (
                  <div key={p.id} className="hp-policy-card">
                    <div className="hp-policy-top">
                      <div>
                        <span className="hp-policy-type">{p.type}</span>
                        <h3 className="hp-policy-name">{p.plan}</h3>
                      </div>
                      <span className={p.isDefault ? "hp-status-pill" : "hp-policy-list-pill"}>{p.status}</span>
                    </div>
                    <div className="hp-policy-rows">
                      {p.number && <div className="hp-policy-row"><span>Policy number</span><span>{p.number}</span></div>}
                      {p.listReference && <div className="hp-policy-row"><span>List reference</span><span>{p.listReference}</span></div>}
                      {p.cover && <div className="hp-policy-row"><span>Cover amount</span><span className="hp-policy-val">{p.cover}</span></div>}
                      <div className="hp-policy-row"><span>{p.isDefault ? "Monthly premium" : "Indicative price"}</span><span className="hp-policy-val">{p.premium}</span></div>
                      {p.next && <div className="hp-policy-row"><span>Next payment</span><span>{p.next}</span></div>}
                      {p.addedDate && <div className="hp-policy-row"><span>Added</span><span>{p.addedDate}</span></div>}
                    </div>
                    <div className="hp-policy-actions">
                      <button className="hp-btn-outline" onClick={() =>
                        navigate("/chat", { state: p.isDefault ? { policyCard: p } : { catalogueCard: p } })
                      }>Ask Candor</button>
                      <button className="hp-btn-ghost" onClick={() => setPolicyDetails(p)}>View details</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="hp-policy-card hp-policy-cta" onClick={() => setView("add-policy")}>
                  <span className="hp-cta-plus">+</span>
                  <span className="hp-policy-cta-title">Add a policy</span>
                  <span>Browse available plans</span>
                </button>
              </div>
            )}
          </section>

          <section className="hp-section">
            <div className="hp-section-head">
              <div className="hp-section-bar" />
              <h2>Recent claims</h2>
              <button className="hp-link-btn" onClick={openClaimForm}>Submit a claim</button>
            </div>
            {claimNotice && <p className="hp-claim-notice" role="status">{claimNotice}</p>}
            {claimsError && <p className="hp-claim-error" role="alert">{claimsError}</p>}
            <div className="hp-claims-table">
              <div className="hp-claims-head">
                <span>Type</span><span>Reference</span><span>Date submitted</span><span>Benefit amount</span><span>Status</span>
              </div>
              {claimsLoading && <p className="hp-claims-loading" role="status">Checking for your submitted claims…</p>}
              {!claimsLoading && !claimsError && recentClaims.length === 0 && <p className="hp-claims-empty">You have not submitted any claims yet.</p>}
              {recentClaims.map(claim => (
                <div key={claim.key} className="hp-claims-row">
                  <span>{claim.type}</span>
                  <span className="hp-claims-ref">{claim.ref}</span>
                  <span>{claim.date}</span>
                  <span className="hp-claims-amount">{claim.amount}</span>
                  <span className={`hp-claims-status ${claim.paid ? "paid" : "progress"}`}>{claim.status}</span>
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
              {BENEFITS.map(b => (
                <div key={b.id} className="hp-benefit-card">
                  <img src={b.img} alt={b.title} />
                  <div className="hp-benefit-body">
                    <h4>{b.title}</h4>
                    <p>{b.summary}</p>
                    <button className="hp-benefit-link" onClick={() => setBenefitModal(b)}>{b.cta}</button>
                  </div>
                </div>
              ))}
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

      {claimFormOpen && (
        <div className="hp-benefit-modal-backdrop" onClick={() => !claimSubmitting && setClaimFormOpen(false)}>
          <section className="hp-benefit-modal hp-claim-modal" role="dialog" aria-modal="true" aria-labelledby="claim-form-title" onClick={event => event.stopPropagation()}>
            <button type="button" className="hp-benefit-modal-close" onClick={() => setClaimFormOpen(false)} aria-label="Close claim form" disabled={claimSubmitting}>×</button>
            <div className="hp-benefit-modal-body">
              <span className="hp-policy-type">Death benefit</span>
              <h3 id="claim-form-title">Submit a claim</h3>
              <p className="hp-benefit-modal-summary">Tell us about the claimant and the insured person. We’ll register your claim for review and show it in Recent claims.</p>
              <form className="hp-claim-form" onSubmit={submitClaim}>
                <label><span className="hp-claim-label-text">Type of claim <span className="hp-claim-required" aria-hidden="true">*</span></span>
                  <select name="claim_type" required value={claimForm.claim_type} onChange={event => setClaimForm({ ...claimForm, claim_type: event.target.value })}>
                    {CLAIM_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </label>
                <label><span className="hp-claim-label-text">Claimant’s full name <span className="hp-claim-required" aria-hidden="true">*</span></span>
                  <input name="claimant_name" autoComplete="name" required maxLength={255} value={claimForm.claimant_name} onChange={event => setClaimForm({ ...claimForm, claimant_name: event.target.value })} />
                </label>
                <label><span className="hp-claim-label-text">Relationship to the insured person <span className="hp-claim-required" aria-hidden="true">*</span></span>
                  <select name="claimant_relationship" required value={claimForm.claimant_relationship} onChange={event => setClaimForm({ ...claimForm, claimant_relationship: event.target.value })}>
                    <option value="">Select relationship</option>
                    <option>Spouse or partner</option><option>Child</option><option>Parent</option><option>Sibling</option><option>Other family member</option><option>Other</option>
                  </select>
                </label>
                <label><span className="hp-claim-label-text">Insured person’s full name <span className="hp-claim-required" aria-hidden="true">*</span></span>
                  <input name="deceased_name" required maxLength={255} value={claimForm.deceased_name} onChange={event => setClaimForm({ ...claimForm, deceased_name: event.target.value })} />
                </label>
                <label><span className="hp-claim-label-text">Insured person’s identity document <span className="hp-claim-required" aria-hidden="true">*</span></span>
                  <select name="deceased_document_type" required value={claimForm.deceased_document_type} onChange={event => setClaimForm({ ...claimForm, deceased_document_type: event.target.value, deceased_id_number: '', passport_country: '' })}>
                    <option value="ID">South African ID</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </label>
                {claimForm.deceased_document_type === 'ID' ? (
                  <label><span className="hp-claim-label-text">13-digit South African ID number <span className="hp-claim-required" aria-hidden="true">*</span></span>
                    <input name="deceased_id_number" type="text" inputMode="numeric" required minLength={13} maxLength={13} pattern="[0-9]{13}" title="Enter exactly 13 digits" autoComplete="off" value={claimForm.deceased_id_number} onChange={event => setClaimForm({ ...claimForm, deceased_id_number: event.target.value.replace(/\D/g, '') })} />
                  </label>
                ) : (
                  <>
                    <label><span className="hp-claim-label-text">Passport number <span className="hp-claim-required" aria-hidden="true">*</span></span>
                      <input name="deceased_id_number" type="text" required maxLength={50} autoComplete="off" value={claimForm.deceased_id_number} onChange={event => setClaimForm({ ...claimForm, deceased_id_number: event.target.value })} />
                    </label>
                    <label><span className="hp-claim-label-text">Passport country of origin <span className="hp-claim-required" aria-hidden="true">*</span></span>
                      <select name="passport_country" required value={claimForm.passport_country} onChange={event => setClaimForm({ ...claimForm, passport_country: event.target.value })}>
                        <option value="">Select country</option>
                        {PASSPORT_COUNTRIES.map(country => <option key={country}>{country}</option>)}
                      </select>
                    </label>
                  </>
                )}
                <label><span className="hp-claim-label-text">Date of death <span className="hp-claim-required" aria-hidden="true">*</span></span>
                  <input name="date_of_death" type="date" required max={todayDate} value={claimForm.date_of_death} onChange={event => setClaimForm({ ...claimForm, date_of_death: event.target.value })} />
                </label>
                <label className="hp-claim-notes">Anything else we should know? <span>(optional)</span>
                  <textarea name="notes" rows="3" maxLength={2000} value={claimForm.notes} onChange={event => setClaimForm({ ...claimForm, notes: event.target.value })} />
                </label>
                <div className="hp-claim-docs">
                  <strong>Documents you’ll need for review</strong>
                  <ul>
                    <li>Certified death certificate / DHA-1663 notice of death</li>
                    <li>Certified ID copies for the insured person and claimant</li>
                    <li>Recent bank statement for the claimant</li>
                  </ul>
                  <span>You can submit this form now; our team may request these documents during review.</span>
                </div>
                {claimError && <p className="hp-claim-error" role="alert">{claimError}</p>}
                <div className="hp-claim-form-actions">
                  <button type="button" className="hp-btn-ghost" onClick={() => setClaimFormOpen(false)} disabled={claimSubmitting}>Cancel</button>
                  <button type="submit" className="hp-btn-primary" disabled={claimSubmitting}>{claimSubmitting ? "Submitting…" : "Send claim"}</button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}

      {policyDetails && (
        <div className="hp-benefit-modal-backdrop" onClick={() => setPolicyDetails(null)}>
          <section className="hp-benefit-modal hp-policy-detail-modal" role="dialog" aria-modal="true" aria-labelledby="policy-detail-title" onClick={event => event.stopPropagation()}>
            <button className="hp-benefit-modal-close" onClick={() => setPolicyDetails(null)} aria-label="Close policy details">×</button>
            <img src={policyDetails.img} alt="" className="hp-benefit-modal-img" />
            <div className="hp-benefit-modal-body">
              <span className="hp-policy-type">{policyDetails.type}</span>
              <h3 id="policy-detail-title">{policyDetails.plan}</h3>
              <p className="hp-benefit-modal-summary">{policyDetails.description}</p>
              <p className="hp-policy-detail-meta">{policyDetails.number ? `Policy number: ${policyDetails.number} · ${policyDetails.status}` : `List reference: ${policyDetails.listReference} · Added ${policyDetails.addedDate}`}</p>
              {policyDetails.cover && <p className="hp-policy-detail-price">Cover amount: {policyDetails.cover}</p>}
              <p className="hp-policy-detail-price">{policyDetails.isDefault ? "Monthly premium" : "Indicative price"}: {policyDetails.premium}</p>
              {policyDetails.next && <p className="hp-policy-detail-meta">Next payment: {policyDetails.next}</p>}
              <h4>Included features</h4>
              <ul className="hp-benefit-modal-list">{policyDetails.benefits.map(item => <li key={item}>{item}</li>)}</ul>
              {!policyDetails.isDefault && <p className="hp-policy-disclaimer">This is a saved catalogue example, not an active insurance policy. Adding it to your list does not purchase or activate cover.</p>}
              <button className="hp-btn-primary hp-benefit-modal-btn" onClick={() => setPolicyDetails(null)}>Close</button>
            </div>
          </section>
        </div>
      )}

      {benefitModal && (
        <div className="hp-benefit-modal-backdrop" onClick={() => setBenefitModal(null)}>
          <div className="hp-benefit-modal" onClick={e => e.stopPropagation()}>
            <button className="hp-benefit-modal-close" onClick={() => setBenefitModal(null)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img src={benefitModal.img} alt={benefitModal.title} className="hp-benefit-modal-img" />
            <div className="hp-benefit-modal-body">
              <h3>{benefitModal.title}</h3>
              <p className="hp-benefit-modal-summary">{benefitModal.summary}</p>
              <ul className="hp-benefit-modal-list">
                {benefitModal.details.map(d => <li key={d}>{d}</li>)}
              </ul>
              <button className="hp-btn-primary hp-benefit-modal-btn" onClick={() => setBenefitModal(null)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
