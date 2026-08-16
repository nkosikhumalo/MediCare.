function HelpButton() {
  return (
    <button className="help-fab">
      <svg viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="#EB2E2E"
          strokeWidth="1.8"
        />

        <path
          d="M9.5 9.3a2.5 2.5 0 014.9.7c0 1.7-2.4 1.7-2.4 3.4"
          stroke="#EB2E2E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <circle
          cx="12"
          cy="16.6"
          r="0.9"
          fill="#EB2E2E"
        />
      </svg>
    </button>
  );
}

export default HelpButton;