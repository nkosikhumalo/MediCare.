import { useState } from "react";
import "../styles/cookie-consent.css";

const CONSENT_KEY = "candor_cookie_consent";

function readChoice() {
  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    return saved === "accepted" || saved === "declined" ? saved : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [choice, setChoice] = useState(readChoice);
  const [showDialog, setShowDialog] = useState(choice === null);

  function saveChoice(nextChoice) {
    try {
      localStorage.setItem(CONSENT_KEY, nextChoice);
    } catch {
      // Without persistent consent storage, the API guard remains closed.
      nextChoice = "declined";
    }
    setChoice(nextChoice);
    setShowDialog(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: nextChoice }));
  }

  return (
    <>
      <button className="cookie-settings-link" type="button" onClick={() => setShowDialog(true)}>
        Cookie settings
      </button>
      {choice === "declined" && !showDialog && (
        <p className="cookie-status" role="status">
          Session cookies are off. Sign in and account features are unavailable. <button type="button" onClick={() => setShowDialog(true)}>Change choice</button>
        </p>
      )}
      {showDialog && (
        <div className="cookie-consent-backdrop">
          <section className="cookie-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description">
            <p className="cookie-consent-eyebrow">Your privacy</p>
            <h2 id="cookie-consent-title">Allow the session cookie?</h2>
            <p id="cookie-consent-description">
              Candor uses one essential, HttpOnly session cookie to keep you signed in and protect account requests. It is set after you sign in and expires after 15 minutes. Candor does not use cookies for advertising or analytics.
            </p>
            <p className="cookie-consent-note">
              If you decline, Candor will not send or accept this session cookie. You can still browse public pages, but signing in, registering, and account features will not work. You can change your choice at any time in Cookie settings.
            </p>
            <div className="cookie-consent-actions">
              <button className="cookie-consent-decline" type="button" onClick={() => saveChoice("declined")}>Decline</button>
              <button className="cookie-consent-accept" type="button" onClick={() => saveChoice("accepted")}>Allow session cookie</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
