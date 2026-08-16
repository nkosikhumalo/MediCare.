import { useState } from "react";
import Logo from "../components/Logo";
import { register as registerUser } from "../services/authService";
import "../styles/register.css";

function Register() {

  const [citizen, setCitizen] = useState("SA");
  const [submitted, setSubmitted] = useState(false);
  const [verified, setVerified] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: ""
  });


  if (submitted) {
    return (
      <div className="register-page">

        <div className="wrap">

          <Logo />

          <div className="card success-screen">

            <div className="check">
              ✓
            </div>

            <h2>
              Details submitted
            </h2>

            <p>
              We're verifying your details.
              You can now log in with your new username.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => window.location.href = "/login"}
            >
              Continue to log in
            </button>

          </div>

        </div>

      </div>
    );
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!verified) {
      alert("Please confirm the verification checkbox to continue.");
      return;
    }

    try {
      await registerUser(formData);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to connect to the server.");
    }
  }



  return (
    <div className="register-page">

      <div className="topbar">
        <a href="/">
          Done
        </a>
      </div>


      <div className="wrap">

        <Logo />


        <h1>
          Register now
        </h1>

        <p className="subtitle">
          We will verify your details in the next step.
        </p>


        <div className="card">


          <div className="tabs">

            <div
              className={`tab ${citizen === "SA" ? "active" : ""}`}
              onClick={() => setCitizen("SA")}
            >
              SA Citizen
            </div>


            <div
              className={`tab ${citizen === "NON-SA" ? "active" : ""}`}
              onClick={() => setCitizen("NON-SA")}
            >
              Non-SA Citizen
            </div>

          </div>



          <form onSubmit={handleSubmit}>


            <div className="field">
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder=" "
              />
              <label>
                First name
              </label>
            </div>


            <div className="field">
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder=" "
              />
              <label>
                Surname
              </label>
            </div>



            {
              citizen === "SA" ? (

                <div className="field">
                  <input placeholder=" " />
                  <label>
                    South African ID number
                  </label>
                </div>

              ) : (

                <>

                  <div className="field">
                    <input placeholder=" " />
                    <label>
                      Passport number
                    </label>
                  </div>


                  <div className="field select-field">

                    <label>
                      Country of issue
                    </label>

                    <select>
                      <option>
                        Select country
                      </option>
                      <option>
                        South Africa
                      </option>
                      <option>
                        Zimbabwe
                      </option>
                    </select>

                  </div>

                </>

              )
            }



            <div className="field">
              <input placeholder=" " />
              <label>
                Date of birth
              </label>
            </div>


            <div className="hint-text">
              DD/MM/YYYY
            </div>



            <div className="field select-field">

              <label>
                Country code
              </label>

              <select>
                <option>
                  🇿🇦 South Africa +27
                </option>
              </select>

            </div>



            <div className="field">
              <input placeholder=" " />
              <label>
                Cell phone number
              </label>
            </div>


            <div className="field">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
              />
              <label>
                Email address
              </label>
            </div>


            <div className="field">
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder=" "
              />
              <label>
                Username
              </label>
            </div>

            <div className="field">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Password</label>
            </div>



            <div className="verify-box">

              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
              />

              <span>
                Verify you're not a robot
              </span>

            </div>



            <button className="btn btn-primary">
              Continue
            </button>


          </form>



          <a href="/" className="cancel-link">
            Cancel
          </a>


        </div>



        <div className="legal">

          An authorised financial services and registered credit provider.

          <br />

          ©2026 Metropolitan Life Limited.

          <br />

          <a href="#">
            Legal and Compliance
          </a>
          {" | "}
          <a href="#">
            Security and Fraud
          </a>
          {" | "}
          <a href="#">
            Terms and Conditions
          </a>

        </div>


      </div>


    </div>
  );
}

export default Register;