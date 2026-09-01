import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quote.css";

export default function Quote() {
    const navigate = useNavigate();
    const [step, setStep] = useState("form"); // "form" | "sent"
    const [action, setAction] = useState(null); // "quote" | "call"
    const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: "" }));
    }

    function validate() {
        const errs = {};
        if (!formData.name.trim()) errs.name = "Name is required";
        if (!/^\+?[\d\s\-]{7,15}$/.test(formData.phone)) errs.phone = "Valid phone number required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Valid email required";
        return errs;
    }

    function handleCTA(type) {
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setAction(type);
        setStep("sent");
    }

    if (step === "sent") {
        return (
            <div className="quote-page">
                <div className="quote-wrap">
                    <div className="quote-success-card">
                        <div className="quote-check">{action === "quote" ? "📄" : "📞"}</div>
                        <h2>{action === "quote" ? "Quote sent!" : "We'll call you!"}</h2>
                        <p>
                            {action === "quote"
                                ? `We just sent a personalised quote to ${formData.email}. Check your inbox — it should arrive within a few minutes.`
                                : `Thanks ${formData.name}. One of our advisers will call you at ${formData.phone} shortly.`}
                        </p>
                        <button className="quote-btn" onClick={() => navigate("/home")}>Back to home</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quote-page">
            <div className="quote-topbar">
                <button type="button" className="quote-back" onClick={() => navigate(-1)}>← Back</button>
            </div>

            <div className="quote-wrap">
                <div className="quote-brand">
                    <span className="brand-medi">Medi</span><span className="brand-care">Care</span><span className="brand-dot-navy">.</span>
                </div>
                <h1>Get a quote</h1>
                <p className="quote-sub">Fill in your details and choose how you'd like to hear from us.</p>

                <div className="quote-card">
                    <div className="qfield">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder=" "
                        />
                        <label>Full name</label>
                        {errors.name && <span className="q-err">{errors.name}</span>}
                    </div>

                    <div className="qfield">
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder=" "
                            inputMode="tel"
                        />
                        <label>Phone number</label>
                        {errors.phone && <span className="q-err">{errors.phone}</span>}
                    </div>

                    <div className="qfield">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder=" "
                        />
                        <label>Email address</label>
                        {errors.email && <span className="q-err">{errors.email}</span>}
                    </div>

                    <div className="quote-cta-row">
                        <button type="button" className="quote-btn" onClick={() => handleCTA("quote")}>
                            Get a quote
                        </button>
                        <button type="button" className="quote-btn quote-btn-outline" onClick={() => handleCTA("call")}>
                            Get a call
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
