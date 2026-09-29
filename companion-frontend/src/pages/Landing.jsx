import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/landing.css";

// ── Static data ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "medical-aid", label: "Medical aid" },
  { key: "car-home", label: "Car & home insurance" },
  { key: "life-insurance", label: "Life insurance" },
  { key: "investments", label: "Investments" },
  { key: "savings", label: "Savings" },
  { key: "wills-estates", label: "Wills, Trusts & Estates" },
];

const SECTIONS = {
  "medical-aid": {
    label: "Medical aid", eyebrow: "Healthcare cover",
    hero: "Understand your healthcare cover.",
    heroSub: "Explore a sample medical aid experience: learn how everyday care, hospital treatment, and plan limits can fit together.",
    demoNote: "Demo information: these sample plan names, prices, and benefits are fictional and do not represent an available medical aid scheme.",
    overviewTitle: "What is medical aid?",
    overview: "Medical aid is a healthcare funding arrangement that helps members pay for eligible medical care. Depending on the scheme and option, cover may include hospital treatment, visits to healthcare professionals, prescribed medicine, or ongoing care for certain conditions. Rules, provider networks, limits, and co-payments vary by plan.",
    howItWorks: ["Hospital cover can help with eligible admission and in-hospital treatment.", "Day-to-day benefits may contribute toward GP visits, dentistry, or medicine, subject to plan rules.", "Some schemes use designated provider networks, and using providers outside the network can affect what is paid."],
    heroImg: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=500&fit=crop&auto=format&q=80",
    plans: [
      { name: "Essential Smart", price: "From R 645 / mo", desc: "Day-to-day cover including GP visits, chronic medication, and emergency care.", features: ["Unlimited GP visits", "Chronic disease management", "Emergency room cover", "Optical & dental basics"] },
      { name: "Hospital Plus", price: "From R 1 050 / mo", desc: "Full hospital cover with specialist access and extended day-to-day benefits.", features: ["Private hospital access", "Specialist consultations", "Maternity benefits", "MRI & CT scans"] },
      { name: "Comprehensive", price: "From R 1 890 / mo", desc: "Our most complete plan — unlimited cover for families who want full peace of mind.", features: ["Unlimited specialist visits", "Full dental & orthodontics", "Mental health support", "International cover"] },
    ],
    facts: ["Sample plan comparisons", "Illustrative benefits", "Review limits and exclusions"],
    img2: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=450&fit=crop&auto=format&q=75",
  },
  "car-home": {
    label: "Car & home insurance", eyebrow: "Short-term insurance",
    hero: "Protect what matters most.",
    heroSub: "Comprehensive cover for your vehicle and property, with cashback every year you don't claim.",
    heroImg: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=500&fit=crop&auto=format&q=80",
    plans: [
      { name: "DriveSecure Basic", price: "From R 280 / mo", desc: "Third-party, fire and theft cover for your vehicle.", features: ["Third-party liability", "Fire & theft", "Emergency towing", "Windscreen cover"] },
      { name: "DriveSecure Comprehensive", price: "From R 480 / mo", desc: "Full vehicle cover with accident damage and cashback rewards.", features: ["Accident damage", "Theft & hijacking", "Roadside assistance", "Rental car while in repairs"] },
      { name: "HomeShield", price: "From R 290 / mo", desc: "Cover for your home structure and all contents against damage and theft.", features: ["Building cover", "Contents cover", "Flood & storm damage", "All-risk portable items"] },
    ],
    facts: ["Up to 30% cashback for claim-free years", "24/7 emergency assistance line", "Repairs at 800+ approved centres"],
    img2: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=700&h=450&fit=crop&auto=format&q=75",
  },
  "life-insurance": {
    label: "Life insurance", eyebrow: "Life & disability cover",
    hero: "Explore how life cover can support your family.",
    heroSub: "See a sample overview of life insurance, beneficiary choices, and optional protection for illness or disability.",
    demoNote: "Demo information: these sample plan names, prices, and benefits are fictional and do not represent an available insurance policy.",
    overviewTitle: "What is life insurance?",
    overview: "Life insurance is a contract that may pay a benefit to nominated beneficiaries if the insured person dies while the policy is active, subject to its terms and exclusions. Some policies offer optional benefits for events such as disability or specified illnesses. The amount of cover, premium, eligibility, waiting periods, and claim requirements depend on the policy.",
    howItWorks: ["Choose a cover amount with your family's needs and existing support in mind.", "Keep beneficiary details current and make sure loved ones know where policy documents are held.", "Read the policy wording for exclusions, waiting periods, premium changes, and claim requirements."],
    heroImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=500&fit=crop&auto=format&q=80",
    plans: [
      { name: "LifeGuard Essential", price: "From R 210 / mo", desc: "Basic life cover with a guaranteed payout to your nominated beneficiaries.", features: ["Death benefit", "Accidental death top-up", "Beneficiary nomination", "No waiting period"] },
      { name: "LifeGuard Plus", price: "From R 310 / mo", desc: "Inflation-linked life cover with terminal illness and disability accelerators.", features: ["Inflation-linked cover", "Terminal illness payout", "Disability accelerator", "Cashback after 5 years"] },
      { name: "AbilityGuard", price: "From R 220 / mo", desc: "Income protection if you can't work due to illness or injury.", features: ["Monthly income replacement", "Temporary & permanent cover", "Own-occupation definition", "Rehabilitation benefit"] },
    ],
    facts: ["Sample cover options", "Illustrative benefits", "Review exclusions and terms"],
    img2: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&h=450&fit=crop&auto=format&q=75",
  },
  "investments": {
    label: "Investments", eyebrow: "Grow your wealth",
    hero: "Your money should work as hard as you do.",
    heroSub: "Local and offshore investment solutions designed to grow and protect your wealth over the long run.",
    heroImg: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=500&fit=crop&auto=format&q=80",
    comingSoon: true,
    plans: [
      { name: "Tax-Free Savings", price: "From R 500 / mo", desc: "Save up to R36 000 per year completely free of tax.", features: ["No tax on growth", "R500 000 lifetime limit", "Flexible contributions", "Wide fund choice"] },
      { name: "Retirement Annuity", price: "From R 750 / mo", desc: "Tax-deductible retirement saving with a range of fund options.", features: ["Up to 27.5% tax deduction", "Compulsory retirement saving", "Living annuity on retirement", "Death benefit"] },
      { name: "Offshore Portfolio", price: "From R 2 000 / mo", desc: "Rand-hedge exposure to global markets through a single investment.", features: ["Global equity access", "Rand hedge", "USD-denominated", "Flexible externalisation"] },
    ],
    facts: ["Over R180 billion assets under management", "200+ local and offshore funds", "Award-winning adviser network"],
    img2: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=700&h=450&fit=crop&auto=format&q=75",
  },
  "savings": {
    label: "Savings", eyebrow: "Build your future",
    hero: "Small steps. Big goals.",
    heroSub: "Flexible savings plans from R500 a month — with rewards for staying committed to your goals.",
    heroImg: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=500&fit=crop&auto=format&q=80",
    comingSoon: true,
    plans: [
      { name: "Starter Savings", price: "From R 500 / mo", desc: "A simple, flexible savings plan with competitive interest rates.", features: ["No fixed term", "Flexible deposits", "Competitive interest", "Online access"] },
      { name: "Goal-Based Savings", price: "From R 1 000 / mo", desc: "Save toward a specific goal — education, home, or holiday.", features: ["Goal tracking dashboard", "Target date setting", "Loyalty bonuses", "Partial withdrawals"] },
      { name: "Education Plan", price: "From R 800 / mo", desc: "Long-term savings plan specifically designed for education funding.", features: ["Inflation-linked growth", "Payout on matric/university", "Life cover built in", "Tax benefits"] },
    ],
    facts: ["Average member saves R2 400 more per year", "Loyalty bonuses from year 3", "No penalties for pausing contributions"],
    img2: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=700&h=450&fit=crop&auto=format&q=75",
  },
  "wills-estates": {
    label: "Wills, Trusts & Estates", eyebrow: "Estate planning",
    hero: "Protect what you leave behind.",
    heroSub: "Professional will drafting, trust setup, and estate administration to give your loved ones certainty.",
    heroImg: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=500&fit=crop&auto=format&q=80",
    comingSoon: true,
    plans: [
      { name: "Will Drafting", price: "From R 350 once-off", desc: "A legally valid will drafted and stored securely by our fiduciary specialists.", features: ["Qualified fiduciary specialists", "Secure digital storage", "Annual review included", "Free update on life events"] },
      { name: "Family Trust", price: "From R 1 200 / mo", desc: "Protect assets for your beneficiaries with a professionally administered trust.", features: ["Asset protection", "Minor beneficiary management", "Tax efficiency", "Professional trustees"] },
      { name: "Estate Administration", price: "Fee on estate value", desc: "Full administration of the deceased estate — from Master's Office to final distribution.", features: ["Master's Office filing", "Creditor settlement", "Asset distribution", "Tax clearance"] },
    ],
    facts: ["Over 200 000 wills drafted and stored", "Average estate administration under 12 months", "FPSA-accredited fiduciary specialists"],
    img2: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&h=450&fit=crop&auto=format&q=75",
  },
};

// ── Pure presentational components (no hooks) ─────────────────────────────────
function LpNav({ activeKey, onNav, onLogin, onAdvice }) {
  return (
    <header className="lp-header">
      <nav className="lp-nav lp-wrap">
        <button type="button" className="lp-brand lp-brand-btn" onClick={() => onNav(null)}>
          Medi<span>Care</span><span className="lp-brand-dot">.</span>
        </button>
        <ul className="lp-nav-links">
          {NAV_ITEMS.map(item => (
            <li key={item.key}>
              <button
                type="button"
                className={`lp-nav-text-btn ${activeKey === item.key ? "lp-nav-active" : ""}`}
                onClick={() => onNav(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="lp-nav-cta">
          <button type="button" className="lp-btn lp-btn-outline lp-login-desktop" onClick={onLogin}>Login / Register</button>
          <button type="button" className="lp-btn lp-btn-outline lp-login-mobile" onClick={onLogin}>Login</button>
          <button type="button" className="lp-btn lp-btn-primary" onClick={onAdvice}>Get advice</button>
        </div>
      </nav>
    </header>
  );
}

function LpFooter({ onNav, onAdvice, onLogin }) {
  return (
    <footer className="lp-footer" id="footer">
      <div className="lp-wrap">
        <div className="lp-fgrid">
          <div>
            <h4>Products</h4>
            <ul>
              {NAV_ITEMS.map(i => (
                <li key={i.key}>
                  <button type="button" className="lp-footer-link-btn" onClick={() => onNav(i.key)}>{i.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>About us</h4>
            <ul>
              <li><a href="#footer">Our business</a></li>
              <li><a href="#footer">Brand story</a></li>
              <li><a href="#footer">Awards</a></li>
              <li><a href="#footer">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4>Get help</h4>
            <ul>
              <li><button type="button" className="lp-footer-link-btn" onClick={onAdvice}>Ask MediCare AI</button></li>
              <li><button type="button" className="lp-footer-link-btn" onClick={onLogin}>Sign in</button></li>
              <li><a href="#footer">Contact us</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="#footer">Legal and compliance</a></li>
              <li><a href="#footer">Security and fraud</a></li>
              <li><a href="#footer">Terms and conditions</a></li>
              <li><a href="#footer">Privacy notice</a></li>
            </ul>
          </div>
        </div>
        <div className="lp-fbottom">
          <span>An authorised financial services and registered credit provider. © 2026 MediCare Limited.</span>
          <span>268 West Avenue, Centurion, 0157</span>
        </div>
      </div>
    </footer>
  );
}

function SectionPage({ sectionKey, onNav, onLogin, onQuote, onAdvice }) {
  const data = SECTIONS[sectionKey];
  if (!data) return null;
  return (
    <div className="landing-page">
      <LpNav activeKey={sectionKey} onNav={onNav} onLogin={onLogin} onAdvice={onAdvice} />

      <div className="lp-section-hero">
        <img src={data.heroImg} alt={data.label} className="lp-section-hero-img" />
        <div className="lp-section-hero-overlay">
          <div className="lp-wrap">
            <p className="lp-eyebrow" style={{ color: "#fca5a5" }}>{data.eyebrow}</p>
            <h1 className="lp-section-hero-h1">{data.hero}</h1>
            <p className="lp-section-hero-sub">{data.heroSub}</p>
            <div className="lp-btn-row" style={{ marginTop: 24 }}>
              {data.comingSoon
                ? <span className="lp-coming-soon-badge">Coming soon</span>
                : <button type="button" className="lp-btn lp-btn-primary" onClick={onQuote}>Get a quote</button>}
              <button type="button" className="lp-btn lp-btn-white-outline" onClick={onAdvice}>Ask MediCare AI</button>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-facts-bar">
        <div className="lp-wrap lp-facts-inner">
          {data.facts.map(f => (
            <div key={f} className="lp-fact">
              <span className="lp-fact-dot" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {data.overview && (
        <section className="lp-section-plans" aria-label={`${data.label} information`}>
          <div className="lp-wrap">
            <p className="lp-eyebrow" style={{ textAlign: "center", marginBottom: 8 }}>Learn the basics</p>
            <h2 className="lp-section-plans-h2">{data.overviewTitle}</h2>
            <p style={{ maxWidth: 820, margin: "0 auto 24px", lineHeight: 1.75, color: "#475569" }}>{data.overview}</p>
            <ul style={{ maxWidth: 820, margin: "0 auto", lineHeight: 1.8, color: "#475569" }}>
              {data.howItWorks.map(item => <li key={item}>{item}</li>)}
            </ul>
            <p role="note" style={{ maxWidth: 820, margin: "24px auto 0", padding: 16, borderRadius: 12, background: "#fff7ed", color: "#9a3412", lineHeight: 1.6 }}>{data.demoNote}</p>
          </div>
        </section>
      )}

      <section className="lp-section-plans">
        <div className="lp-wrap">
          <p className="lp-eyebrow" style={{ textAlign: "center", marginBottom: 8 }}>{data.demoNote ? "Sample plans" : "Our plans"}</p>
          <h2 className="lp-section-plans-h2">Choose what fits your life</h2>
          <div className="lp-plans-grid">
            {data.plans.map((plan, i) => (
              <div key={plan.name} className={`lp-plan-card ${i === 1 ? "lp-plan-featured" : ""}`}>
                {i === 1 && <span className="lp-plan-badge">Most popular</span>}
                <h3>{plan.name}</h3>
                <div className="lp-plan-price">{plan.price}</div>
                <p className="lp-plan-desc">{plan.desc}</p>
                <ul className="lp-plan-features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="2 8 6 12 14 4" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {data.comingSoon
                  ? <button type="button" className="lp-plan-btn lp-plan-btn-disabled" disabled>Coming soon</button>
                  : <button type="button" className={`lp-plan-btn ${i === 1 ? "lp-plan-btn-primary" : "lp-plan-btn-outline"}`} onClick={onQuote}>Get a quote</button>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section-split">
        <div className="lp-wrap lp-split-inner">
          <div className="lp-split-img">
            <img src={data.img2} alt={data.label} />
          </div>
          <div className="lp-split-copy">
            <p className="lp-eyebrow">Why MediCare</p>
            <h2>Trusted by over 1.6 million members across South Africa.</h2>
            <p>Our products are built for real life — affordable, flexible, and backed by a team that answers when you call.</p>
            <div className="lp-btn-row" style={{ marginTop: 20 }}>
              {!data.comingSoon && <button type="button" className="lp-btn lp-btn-primary" onClick={onQuote}>Get a quote</button>}
              <button type="button" className="lp-btn lp-btn-outline" onClick={onLogin}>Sign in</button>
            </div>
          </div>
        </div>
      </section>

      <LpFooter onNav={onNav} onAdvice={onAdvice} onLogin={onLogin} />
    </div>
  );
}

// ── Main export — all hooks live here ────────────────────────────────────────
function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [showSignInGate, setShowSignInGate] = useState(false);

  const params = new URLSearchParams(location.search);
  const activeSection = params.get("section") || null;

  function navTo(key) {
    navigate(key ? `/?section=${key}` : "/");
    window.scrollTo(0, 0);
  }

  function goToLogin(from = "/home") {
    navigate("/login", { state: { from } });
  }

  function goToQuote() {
    navigate("/quote");
  }

  function openCandor() {
    if (token) { navigate("/chat"); return; }
    setShowSignInGate(true);
  }

  function signInForCandor() {
    setShowSignInGate(false);
    goToLogin("/chat");
  }

  // Section detail page
  if (activeSection && SECTIONS[activeSection]) {
    return (
      <SectionPage
        sectionKey={activeSection}
        onNav={navTo}
        onLogin={() => goToLogin("/home")}
        onQuote={goToQuote}
        onAdvice={openCandor}
      />
    );
  }

  // Home page
  return (
    <div className="landing-page">
      <LpNav activeKey={null} onNav={navTo} onLogin={() => goToLogin("/home")} onAdvice={openCandor} />

      <section className="lp-hero">
        <div className="lp-wrap">
          <p className="lp-eyebrow">Start your next move</p>
          <h1>Get an online quote in minutes</h1>

          <div className="lp-ai-banner">
            <div>
              <span className="lp-ai-badge">New</span>
              <h3>Not sure what you actually need?</h3>
              <p>Tell MediCare what&apos;s going on in your life — new baby, new car, new job — and it&apos;ll point you to the right cover.</p>
            </div>
            <button type="button" className="lp-btn lp-btn-primary" onClick={openCandor}>Ask MediCare AI</button>
          </div>

          <div className="lp-quote-cards" id="quote">
            <div className="lp-qcard">
              <div className="lp-art"><img src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&h=400&fit=crop&auto=format&q=70" alt="Hospital room" /></div>
              <div className="lp-body">
                <span className="lp-cat">Medical aid</span>
                <h3>Save up to 30% on your monthly plan</h3>
                <p>Compare hospital and day-to-day cover options built around your budget.</p>
                <button type="button" className="lp-btn lp-btn-primary" onClick={() => navTo("medical-aid")}>Learn more</button>
              </div>
            </div>
            <div className="lp-qcard">
              <div className="lp-art"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=400&fit=crop&auto=format&q=70" alt="Home exterior" /></div>
              <div className="lp-body">
                <span className="lp-cat">Life insurance</span>
                <h3>A discounted quote in three minutes</h3>
                <p>Cover that adjusts to your health, with rewards for staying well.</p>
                <button type="button" className="lp-btn lp-btn-primary" onClick={() => navTo("life-insurance")}>Learn more</button>
              </div>
            </div>
            <div className="lp-qcard">
              <div className="lp-art"><img src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=400&fit=crop&auto=format&q=70" alt="Car" /></div>
              <div className="lp-body">
                <span className="lp-cat">Car &amp; home insurance</span>
                <h3>Cashback on your premium, even if you claim</h3>
                <p>Protect what you love and earn something back for safe habits.</p>
                <button type="button" className="lp-btn lp-btn-primary" onClick={() => navTo("car-home")}>Learn more</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-advice">
        <div className="lp-wrap lp-advice-grid">
          <div>
            <p className="lp-eyebrow">Get advice</p>
            <h2>People who work with an adviser build more wealth over time</h2>
            <p>Whether you&apos;re planning for retirement, protecting your family, or growing long-term savings, an accredited financial adviser helps you turn a plan into a number worth working toward.</p>
            <div className="lp-btn-row">
              <button type="button" className="lp-btn lp-btn-primary" onClick={openCandor}>Talk to MediCare AI</button>
              <button type="button" className="lp-btn lp-btn-outline" onClick={() => goToLogin("/home")}>Sign in</button>
            </div>
          </div>
          <div className="lp-advice-art">
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&h=700&fit=crop&auto=format&q=70" alt="Adviser" />
            <div className="lp-stat">
              <div className="lp-num">9.5×</div>
              <p className="lp-label">more invested, on average, by households working with a financial adviser</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-products" id="products">
        <div className="lp-wrap">
          <h2>Financial solutions for every part of your life</h2>
          <div className="lp-pgrid" style={{ marginTop: 36 }}>
            {NAV_ITEMS.map(item => {
              const s = SECTIONS[item.key];
              const dimmed = !!s?.comingSoon;
              return (
                <div
                  key={item.key}
                  className={`lp-pcard ${dimmed ? "lp-pcard-dim" : ""}`}
                  onClick={dimmed ? undefined : () => navTo(item.key)}
                  style={{ cursor: dimmed ? "default" : "pointer" }}
                >
                  <span className="lp-cat">{s?.eyebrow}</span>
                  <h3>{item.label}</h3>
                  <p>{s?.heroSub?.slice(0, 90)}…</p>
                  <div className="lp-links">
                    {dimmed
                      ? <span className="lp-coming-soon">Coming soon</span>
                      : <span className="primary" style={{ color: "var(--lp-red)", fontWeight: 600, fontSize: 13 }}>Explore →</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lp-stats">
        <div className="lp-wrap lp-stats-row">
          <div><div className="lp-num">2 million</div><div className="lp-label">products held by retail clients</div></div>
          <div><div className="lp-num">R6.5bn</div><div className="lp-label">paid in claims last year</div></div>
          <div><div className="lp-num">16 000+</div><div className="lp-label">people across the group</div></div>
          <div><div className="lp-num">1.6 million</div><div className="lp-label">members and corporate clients</div></div>
        </div>
      </section>

      <section className="lp-stories">
        <div className="lp-wrap">
          <h2>Stories from people who switched</h2>
          <div className="lp-story-grid">
            <div className="lp-story">
              <p className="lp-quote">&ldquo;We compared a few medical schemes before landing here — the flexibility and cashback won us over.&rdquo;</p>
              <div className="lp-who"><img src="https://images.unsplash.com/photo-1565793244233-3d09028aad47?w=100&h=100&fit=crop&auto=format&q=70" alt="Naledi" /><span>Naledi M.</span></div>
            </div>
            <div className="lp-story">
              <p className="lp-quote">&ldquo;Claims used to be the part I dreaded most. Every question I had was answered clearly and quickly.&rdquo;</p>
              <div className="lp-who"><img src="https://images.unsplash.com/photo-1549043671-1e4550948355?w=100&h=100&fit=crop&auto=format&q=70" alt="Kyle" /><span>Kyle R.</span></div>
            </div>
            <div className="lp-story">
              <p className="lp-quote">&ldquo;Setting up my will felt overdue for years. Having someone walk me through it made it far less daunting.&rdquo;</p>
              <div className="lp-who"><img src="https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=100&h=100&fit=crop&auto=format&q=70" alt="Jesmine" /><span>Jesmine J.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-cta-band">
        <div className="lp-wrap">
          <h2>Success has a number. What&apos;s yours?</h2>
          <p>Speak to MediCare AI or an accredited financial adviser and turn your plan into a number worth working toward.</p>
          <div className="lp-btn-row">
            <button type="button" className="lp-btn lp-btn-primary" onClick={openCandor}>Ask MediCare AI</button>
            <button type="button" className="lp-btn lp-btn-outline" onClick={() => goToLogin("/home")}>Sign in</button>
          </div>
        </div>
      </section>

      <LpFooter onNav={navTo} onAdvice={openCandor} onLogin={() => goToLogin("/home")} />

      <button type="button" className="lp-ai-fab" onClick={openCandor} aria-label="Open MediCare AI">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3a5 5 0 0 0-5 5v2a5 5 0 0 0 5 5 5 5 0 0 0 5-5V8a5 5 0 0 0-5-5z" />
          <path d="M8 21h8M12 15v6" />
        </svg>
        <span>Ask MediCare AI</span>
      </button>

      {showSignInGate && (
        <div className="lp-gate-overlay" onClick={() => setShowSignInGate(false)}>
          <div className="lp-gate-panel" onClick={e => e.stopPropagation()}>
            <p className="lp-gate-eyebrow">MediCare AI</p>
            <h3>Sign in to continue</h3>
            <p>Log in with your account to chat with MediCare AI about your policy, cover, and next steps.</p>
            <div className="lp-gate-actions">
              <button type="button" className="lp-btn lp-btn-primary" onClick={signInForCandor}>Sign in</button>
              <button type="button" className="lp-btn lp-btn-outline" onClick={() => { setShowSignInGate(false); navigate("/register"); }}>Create an account</button>
            </div>
            <button type="button" className="lp-gate-close" onClick={() => setShowSignInGate(false)}>Not now</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
