import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/landing.css";

const PRODUCT_TABS = ["Featured", "Medical aid", "Insurance", "Investments", "Savings", "Estates"];

function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("Featured");
  const [showSignInGate, setShowSignInGate] = useState(false);

  function goToLogin(from = "/home") {
    navigate("/login", { state: { from } });
  }

  function goToRegister() {
    navigate("/register");
  }

  /** Candor AI — if logged in go to chat, otherwise prompt sign-in */
  function openCandor() {
    if (token) {
      navigate("/chat");
      return;
    }
    setShowSignInGate(true);
  }

  function signInForCandor() {
    setShowSignInGate(false);
    goToLogin("/chat");
  }

  return (
    <div className="landing-page">
      <div className="lp-utility">
        <div className="lp-wrap">
          <a href="#products">Individual</a>
          <a href="#products">Business</a>
          <a href="#products">Corporate</a>
          <a href="#footer">Contact us</a>
        </div>
      </div>

      <header className="lp-header">
        <nav className="lp-nav lp-wrap">
          <Link to="/" className="lp-brand">
            candor<span>.</span>
          </Link>

          <ul className="lp-nav-links">
            <li><a href="#products">Medical aid</a></li>
            <li><a href="#products">Car &amp; home insurance</a></li>
            <li><a href="#products">Life insurance</a></li>
            <li><a href="#products">Investments</a></li>
            <li><a href="#products">Savings</a></li>
            <li><a href="#products">Wills, Trusts &amp; Estates</a></li>
          </ul>

          <div className="lp-nav-cta">
            <button
              type="button"
              className="lp-btn lp-btn-outline lp-login-desktop"
              onClick={() => goToLogin("/home")}
            >
              Login / Register
            </button>
            <button
              type="button"
              className="lp-btn lp-btn-outline lp-login-mobile"
              onClick={() => goToLogin("/home")}
              aria-label="Login"
            >
              Login
            </button>
            <button type="button" className="lp-btn lp-btn-primary" onClick={openCandor}>
              Get advice
            </button>
          </div>
        </nav>
      </header>

      <section className="lp-hero">
        <div className="lp-wrap">
          <p className="lp-eyebrow">Start your next move</p>
          <h1>Get an online quote in minutes</h1>

          <div className="lp-ai-banner">
            <div>
              <span className="lp-ai-badge">New</span>
              <h3>Not sure what you actually need?</h3>
              <p>
                Tell Candor what&apos;s going on in your life — new baby, new car, new job —
                and it&apos;ll point you to the right cover.
              </p>
            </div>
            <button type="button" className="lp-btn lp-btn-primary" onClick={openCandor}>
              Ask Candor
            </button>
          </div>

          <div className="lp-quote-cards" id="quote">
            <div className="lp-qcard">
              <div className="lp-art">
                <img
                  src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=500&h=400&fit=crop&auto=format&q=70"
                  alt="Family enjoying time outdoors together"
                />
              </div>
              <div className="lp-body">
                <span className="lp-cat">Medical aid</span>
                <h3>Save up to 30% on your monthly plan</h3>
                <p>Compare hospital and day-to-day cover options built around your budget.</p>
                <button type="button" className="lp-btn lp-btn-primary" onClick={() => goToLogin("/home")}>
                  Get a quote
                </button>
              </div>
            </div>

            <div className="lp-qcard">
              <div className="lp-art">
                <img
                  src="https://images.unsplash.com/photo-1529518152792-d08317b26e22?w=500&h=400&fit=crop&auto=format&q=70"
                  alt="Smiling family portrait"
                />
              </div>
              <div className="lp-body">
                <span className="lp-cat">Life insurance</span>
                <h3>A discounted quote in three minutes</h3>
                <p>Cover that adjusts to your health, with rewards for staying well.</p>
                <button type="button" className="lp-btn lp-btn-primary" onClick={() => goToLogin("/home")}>
                  Get a quote
                </button>
              </div>
            </div>

            <div className="lp-qcard">
              <div className="lp-art">
                <img
                  src="https://images.unsplash.com/photo-1739037168325-c905a16ec96d?w=500&h=400&fit=crop&auto=format&q=70"
                  alt="Couple standing beside their car"
                />
              </div>
              <div className="lp-body">
                <span className="lp-cat">Car &amp; home insurance</span>
                <h3>Cashback on your premium, even if you claim</h3>
                <p>Protect what you love and earn something back for safe habits.</p>
                <button type="button" className="lp-btn lp-btn-primary" onClick={() => goToLogin("/home")}>
                  Get a quote
                </button>
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
            <p>
              Whether you&apos;re planning for retirement, protecting your family, or growing
              long-term savings, an accredited financial adviser helps you turn a plan
              into a number worth working toward.
            </p>
            <div className="lp-btn-row">
              <button type="button" className="lp-btn lp-btn-primary" onClick={openCandor}>
                Talk to Candor
              </button>
              <button type="button" className="lp-btn lp-btn-outline" onClick={() => goToLogin("/home")}>
                Sign in
              </button>
            </div>
          </div>
          <div className="lp-advice-art">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&h=700&fit=crop&auto=format&q=70"
              alt="Adviser meeting with a client"
            />
            <div className="lp-stat">
              <div className="lp-num">9.5×</div>
              <p className="lp-label">
                more invested, on average, by households working with a financial adviser
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-products" id="products">
        <div className="lp-wrap">
          <h2>Financial solutions for every part of your life</h2>
          <div className="lp-tabs">
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`lp-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="lp-pgrid">
            <div className="lp-pcard">
              <div className="lp-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 21c-4-3-8-6.5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 0c0 4.5-4 8-8 11z" />
                </svg>
              </div>
              <span className="lp-cat">Medical aid</span>
              <h3>Medical aid plans</h3>
              <p>Options from R645 a month, with day-to-day and hospital cover built around your needs.</p>
              <div className="lp-links">
                <button type="button" className="primary" onClick={() => goToLogin("/home")}>Get a quote</button>
                <a href="#quote">Learn more</a>
              </div>
            </div>

            <div className="lp-pcard">
              <div className="lp-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 3s7 4 7 10a7 7 0 0 1-14 0c0-6 7-10 7-10z" />
                </svg>
              </div>
              <span className="lp-cat">Life insurance</span>
              <h3>Life cover</h3>
              <p>Secure your family&apos;s future and save up to 35% on your monthly premium.</p>
              <div className="lp-links">
                <button type="button" className="primary" onClick={() => goToLogin("/chat")}>Ask Candor</button>
                <a href="#quote">Learn more</a>
              </div>
            </div>

            <div className="lp-pcard">
              <div className="lp-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 12l2-7h14l2 7M5 12h14v7H5z" />
                </svg>
              </div>
              <span className="lp-cat">Short-term insurance</span>
              <h3>Car &amp; home insurance</h3>
              <p>Flexible cover with up to 30% cashback on premiums yearly, even if you claim.</p>
              <div className="lp-links">
                <button type="button" className="primary" onClick={() => goToLogin("/home")}>Get a quote</button>
                <a href="#quote">Learn more</a>
              </div>
            </div>

            <div className="lp-pcard">
              <div className="lp-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 20V10M12 20V4M20 20v-6" />
                </svg>
              </div>
              <span className="lp-cat">Investments</span>
              <h3>Local &amp; offshore investing</h3>
              <p>Solutions designed to grow and protect your wealth over the long run.</p>
              <div className="lp-links">
                <button type="button" className="primary" onClick={() => goToLogin("/home")}>Sign in</button>
                <a href="#quote">Learn more</a>
              </div>
            </div>

            <div className="lp-pcard">
              <div className="lp-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
              <span className="lp-cat">Savings</span>
              <h3>Long-term savings plans</h3>
              <p>From R500 a month, with rewards for staying invested toward your goals.</p>
              <div className="lp-links">
                <button type="button" className="primary" onClick={() => goToLogin("/home")}>Sign in</button>
                <a href="#quote">Learn more</a>
              </div>
            </div>

            <div className="lp-pcard">
              <div className="lp-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 3h9l5 5v13H6z" />
                </svg>
              </div>
              <span className="lp-cat">Wills, trusts &amp; estates</span>
              <h3>Estate planning</h3>
              <p>Protect what you leave behind with will-drafting and estate administration.</p>
              <div className="lp-links">
                <button type="button" className="primary" onClick={() => goToLogin("/home")}>Sign in</button>
                <a href="#quote">Learn more</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-stats">
        <div className="lp-wrap lp-stats-row">
          <div>
            <div className="lp-num">2 million</div>
            <div className="lp-label">products held by retail clients</div>
          </div>
          <div>
            <div className="lp-num">R6.5bn</div>
            <div className="lp-label">paid in life claims last year</div>
          </div>
          <div>
            <div className="lp-num">16 000+</div>
            <div className="lp-label">people across the group</div>
          </div>
          <div>
            <div className="lp-num">1.6 million</div>
            <div className="lp-label">members and corporate clients</div>
          </div>
        </div>
      </section>

      <section className="lp-stories">
        <div className="lp-wrap">
          <h2>Stories from people who switched</h2>
          <div className="lp-story-grid">
            <div className="lp-story">
              <p className="lp-quote">
                &ldquo;We compared a few medical schemes before landing here — it was the flexibility
                and the cashback on things we already do, like the gym, that won us over.&rdquo;
              </p>
              <p className="lp-who">
                <img
                  src="https://images.unsplash.com/photo-1565793244233-3d09028aad47?w=100&h=100&fit=crop&auto=format&q=70"
                  alt="Portrait of Naledi M."
                />
                <span>Naledi M.</span>
              </p>
            </div>
            <div className="lp-story">
              <p className="lp-quote">
                &ldquo;Claims used to be the part I dreaded most about insurance. Every question I
                had was answered clearly and quickly.&rdquo;
              </p>
              <p className="lp-who">
                <img
                  src="https://images.unsplash.com/photo-1549043671-1e4550948355?w=100&h=100&fit=crop&auto=format&q=70"
                  alt="Portrait of Kyle R."
                />
                <span>Kyle R.</span>
              </p>
            </div>
            <div className="lp-story">
              <p className="lp-quote">
                &ldquo;Setting up my will felt overdue for years. Having someone walk me through it
                made it far less daunting than I expected.&rdquo;
              </p>
              <p className="lp-who">
                <img
                  src="https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=100&h=100&fit=crop&auto=format&q=70"
                  alt="Portrait of Jesmine J."
                />
                <span>Jesmine J.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-cta-band">
        <div className="lp-wrap">
          <h2>Success has a number. What&apos;s yours?</h2>
          <p>
            Speak to Candor or an accredited financial adviser and turn your plan into a
            number worth working toward.
          </p>
          <div className="lp-btn-row">
            <button type="button" className="lp-btn lp-btn-primary" onClick={openCandor}>
              Ask Candor
            </button>
            <button type="button" className="lp-btn lp-btn-outline" onClick={() => goToLogin("/home")}>
              Sign in
            </button>
          </div>
        </div>
      </section>

      <footer className="lp-footer" id="footer">
        <div className="lp-wrap">
          <div className="lp-fgrid">
            <div>
              <h4>Individual</h4>
              <ul>
                <li><a href="#products">Medical aid</a></li>
                <li><a href="#products">Car &amp; home insurance</a></li>
                <li><a href="#products">Life insurance</a></li>
                <li><a href="#products">Investments</a></li>
                <li><a href="#products">Savings</a></li>
                <li><a href="#products">Wills, Trusts &amp; Estates</a></li>
              </ul>
            </div>
            <div>
              <h4>About us</h4>
              <ul>
                <li><a href="#quote">Our business</a></li>
                <li><a href="#quote">Our brand story</a></li>
                <li><a href="#quote">Awards</a></li>
                <li><a href="#quote">Careers</a></li>
                <li><a href="#quote">Sponsorships</a></li>
              </ul>
            </div>
            <div>
              <h4>Get help</h4>
              <ul>
                <li><button type="button" className="primary" style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "inherit", cursor: "pointer" }} onClick={openCandor}>Ask Candor</button></li>
                <li><button type="button" style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "inherit", cursor: "pointer" }} onClick={() => goToLogin("/home")}>Sign in</button></li>
                <li><a href="#quote">Contact us</a></li>
                <li><a href="#quote">Download the app</a></li>
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
            <span>
              An authorised financial services and registered credit provider. © 2026 Metropolitan Life Limited.
            </span>
            <span>268 West Avenue, Centurion, 0157</span>
          </div>
        </div>
      </footer>

      <button type="button" className="lp-ai-fab" onClick={openCandor} aria-label="Open Candor AI adviser">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3a5 5 0 0 0-5 5v2a5 5 0 0 0 5 5 5 5 0 0 0 5-5V8a5 5 0 0 0-5-5z" />
          <path d="M8 21h8M12 15v6" />
        </svg>
        <span>Ask Candor</span>
      </button>

      {showSignInGate && (
        <div className="lp-gate-overlay" onClick={() => setShowSignInGate(false)}>
          <div className="lp-gate-panel" onClick={(e) => e.stopPropagation()}>
            <p className="lp-gate-eyebrow">Candor AI</p>
            <h3>Sign in to continue</h3>
            <p>
              Log in with your account to chat with Candor about your policy,
              cover, and next steps.
            </p>
            <div className="lp-gate-actions">
              <button type="button" className="lp-btn lp-btn-primary" onClick={signInForCandor}>
                Sign in
              </button>
              <button type="button" className="lp-btn lp-btn-outline" onClick={goToRegister}>
                Create an account
              </button>
            </div>
            <button type="button" className="lp-gate-close" onClick={() => setShowSignInGate(false)}>
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
