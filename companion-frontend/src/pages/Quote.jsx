import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/quote.css";

const WAITING_PERIOD_OPTIONS = [
    { label: "No waiting period", value: 0 },
    { label: "3 months", value: 3 },
    { label: "6 months", value: 6 },
    { label: "12 months", value: 12 },
    { label: "24 months", value: 24 },
];

export default function Quote() {
    const navigate = useNavigate();
    const { token, user } = useAuth();

    // Redirect if not logged in
    useEffect(() => {
        if (!token) navigate("/login", { replace: true });
    }, [token, navigate]);

    // Redirect if beneficiary — they can't access What-If
    useEffect(() => {
        if (user?.role === "ROLE_BENEFICIARY") navigate("/home", { replace: true });
    }, [user, navigate]);

    const [form, setForm] = useState({
        currentPremium: "",
        currentSumAssured: "",
        requestedSumAssured: "",
        waitingPeriodMonths: 0,
    });
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        setErrors(p => ({ ...p, [name]: "" }));
        setApiError(null);
        setResult(null);
    }

    function validate() {
        const errs = {};
        const cp = parseFloat(form.currentPremium);
        const cs = parseFloat(form.currentSumAssured);
        const rs = parseFloat(form.requestedSumAssured);
        if (!form.currentPremium || isNaN(cp) || cp <= 0) errs.currentPremium = "Enter your current monthly premium (e.g. 620)";
        if (!form.currentSumAssured || isNaN(cs) || cs <= 0) errs.currentSumAssured = "Enter your current sum assured (e.g. 1500000)";
        if (!form.requestedSumAssured || isNaN(rs) || rs <= 0) errs.requestedSumAssured = "Enter the cover amount you want to explore";
        return errs;
    }

    async function simulate() {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        setApiError(null);
        try {
            const data = await apiFetch("/api/what-if/simulate", {
                method: "POST",
                body: JSON.stringify({
                    currentPremium: parseFloat(form.currentPremium),
                    currentSumAssured: parseFloat(form.currentSumAssured),
                    requestedSumAssured: parseFloat(form.requestedSumAssured),
                    waitingPeriodMonths: parseInt(form.waitingPeriodMonths, 10),
                }),
            });
            setResult(data);
        } catch (err) {
            setApiError(err.message || "Simulation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const fmt = (n) => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="quote-page">
            <div className="quote-topbar">
                <button className="quote-back" onClick={() => navigate(-1)}>← Back</button>
            </div>

            <div className="quote-wrap">
                <div className="quote-brand">
                    <span className="brand-medi">Medi</span><span className="brand-care">Care</span><span className="brand-dot-navy">.</span>
                </div>
                <h1>What-If simulator</h1>
                <p className="quote-sub">Explore how changing your cover affects your premium. This is an estimate — not a final quote.</p>

                <div className="quote-card">
                    <div className="qfield">
                        <input type="number" name="currentPremium" value={form.currentPremium}
                            onChange={handleChange} placeholder=" " min="0" />
                        <label>Current monthly premium (R)</label>
                        {errors.currentPremium && <span className="q-err">{errors.currentPremium}</span>}
                    </div>

                    <div className="qfield">
                        <input type="number" name="currentSumAssured" value={form.currentSumAssured}
                            onChange={handleChange} placeholder=" " min="0" />
                        <label>Current sum assured (R)</label>
                        {errors.currentSumAssured && <span className="q-err">{errors.currentSumAssured}</span>}
                    </div>

                    <div className="qfield">
                        <input type="number" name="requestedSumAssured" value={form.requestedSumAssured}
                            onChange={handleChange} placeholder=" " min="0" />
                        <label>Requested sum assured (R)</label>
                        {errors.requestedSumAssured && <span className="q-err">{errors.requestedSumAssured}</span>}
                    </div>

                    <div className="qfield qfield-select">
                        <label className="qfield-select-label">Waiting period</label>
                        <select name="waitingPeriodMonths" value={form.waitingPeriodMonths} onChange={handleChange}>
                            {WAITING_PERIOD_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {apiError && <p className="q-api-err">{apiError}</p>}

                    <div className="quote-cta-row">
                        <button className="quote-btn" onClick={simulate} disabled={loading}>
                            {loading ? "Calculating…" : "Simulate"}
                        </button>
                    </div>
                </div>

                {result && (
                    <div className="whatif-result">
                        <div className="whatif-result-header">
                            <span className="whatif-label">Estimated new premium</span>
                            <span className="whatif-premium">{fmt(result.estimatedPremium)}<span className="whatif-mo">/mo</span></span>
                        </div>

                        <div className="whatif-rows">
                            <div className="whatif-row">
                                <span>Waiting period factor</span>
                                <span>{result.appliedFactor}</span>
                            </div>
                            <div className="whatif-row">
                                <span>Waiting period</span>
                                <span>{result.waitingPeriodMonths === 0 ? "None" : `${result.waitingPeriodMonths} months`}</span>
                            </div>
                        </div>

                        <p className="whatif-tradeoff">{result.tradeOffSummary}</p>

                        <div className="whatif-disclaimer">
                            This is a simulation only — not a final quote. Speak to an adviser to confirm.
                        </div>

                        {result.humanReviewOffered && (
                            <button className="quote-btn quote-btn-outline whatif-adviser-btn"
                                onClick={() => navigate("/chat")}>
                                Talk to an adviser via Candor
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
