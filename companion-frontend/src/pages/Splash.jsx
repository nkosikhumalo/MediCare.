import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/splash.css";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="screen splash">
      <svg
        className="shape-red"
        viewBox="0 0 390 844"
        preserveAspectRatio="none"
      >
        <path
          d="M0,300 C120,220 270,330 390,255 L390,844 L0,844 Z"
          fill="#EB2E2E"
        />
      </svg>

      <svg
        className="shape-lightblue"
        viewBox="0 0 390 844"
        preserveAspectRatio="none"
      >
        <path
          d="M0,844 L0,812 C140,700 280,830 390,758 L390,844 Z"
          fill="#CFE9F1"
        />
      </svg>

      <div className="splash-inner">
        <div className="word">candor</div>
        <div className="tag">
          Here for your journey to success
        </div>
      </div>
    </div>
  );
}

export default Splash;