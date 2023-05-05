import { useState } from "react";
import "./SignUp.css";
import { Link } from "react-router-dom";

function SignUpForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    // Send a POST request to the server with the form data
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation registerUser($input: fullname
            username
            email
            password) {
            registerUser(input: $input) {
              AuthPayload
            }
          }
        `,
        variables: {
          input: formData,
        },
      }),
    });

    // If the request was successful, redirect to the login page
    if (response.ok) {
      window.location.href = "/login";
    } else {
      const data = await response.json();
      console.log(data.errors);
    }
  };

  const onChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="overlay">
      <form onSubmit={onSubmit}>
        <div className="con">
          <header className="head-form">
            <h2>Sign Up</h2>
            <p>login here using your username and password</p>
          </header>
          <br />
          <div className="field-set">
            <span className="input-item">
              <i className="fa fa-user-circle"></i>
            </span>
            <input
              className="form-input"
              id="fullname-input"
              type="text"
              placeholder="@Fullname"
              name="fullname"
              value={formData.fullname}
              onChange={onChange}
              required
            />
            <br />
          </div>
          <div className="field-set">
            <span className="input-item">
              <i className="fa fa-user-circle"></i>
            </span>
            <input
              className="form-input"
              id="username-input"
              type="text"
              placeholder="@UserName"
              name="username"
              onChange={onChange}
              value={formData.username}
              required
            />
            <br />
          </div>
          <div className="field-set">
            <span className="input-item">
              <i className="fa fa-user-circle"></i>
            </span>
            <input
              className="form-input"
              id="email-input"
              type="email"
              placeholder="@Email"
              name="email"
              onChange={onChange}
              value={formData.email}
              required
            />
            <br />
          </div>
          <div className="field-set">
            <span className="input-item">
              <i className="fa fa-key"></i>
            </span>
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="pwd"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
            />
            <span>
              <i
                className={`fa fa-eye${showPassword ? "-slash" : ""}`}
                aria-hidden="true"
                type="button"
                id="eye"
                onClick={togglePasswordVisibility}
              ></i>
            </span>
          </div>
          <div className="field-set">
            <span className="input-item">
              <i className="fa fa-key"></i>
            </span>
            <input
              className="form-input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              id="pwd2"
              name="password2"
              onChange={onChange}
              required
            />
            <span>
              <i
                className={`fa fa-eye${showConfirmPassword ? "-slash" : ""}`}
                aria-hidden="true"
                type="button"
                id="eye"
                onClick={toggleConfirmPasswordVisibility}
              ></i>
            </span>
          </div>
          <div className="field-set">
            <br />
            <button type="submit" className="log-in">
              {" "}
              Sign Up
            </button>
          </div>

          <div className="other">
            <button className="btn submits frgt-pass">Forgot Password</button>
            <Link to="/login">
              <button className="btn submits sign-up">
                Login <i className="fa-solid fa-right-to-bracket"></i>
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
