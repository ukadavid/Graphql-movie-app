import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
  
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation loginUser($input: email, password) {
            loginUser(input: $input) {
              AuthPayload
            }
          }
        `,
        variables: {
          input: formData,
        },
      }),
    });
  
    const responseData = await response.json();

    if (response.ok) {
      if (responseData.data) {
        const { token } = responseData.data.login;
        localStorage.setItem('token', token);
        window.location.href = "/dashboard";
      } else {
        const errorMessage = responseData.errors[0].message;
        setError(errorMessage);
      }
    } else {
      const errorMessage = responseData.errors[0].message;
      setError(errorMessage);
    }
  };
  

  const onChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="overlay">
      <form onSubmit={onSubmit}>
        <div className="con">
          <header className="head-form">
            <h2>Log In</h2>
            <p>login here using your username and password</p>
          </header>
          <br />
          <div className="field-set">
          {error && <p className="error">{error}</p>}
            <span className="input-item">
              <i className="fa fa-user-circle"></i>
            </span>
            <input
              className="form-input"
              id="email-input"
              type="email"
              placeholder="@Email"
              value={formData.email}
              onChange={onChange}
              name="email"
              required
            />
            <br />
            <span className="input-item">
              <i className="fa fa-key"></i>
            </span>
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="pwd"
              value={formData.password}
              onChange={onChange}
              name="password"
              required
            />
            <span>
              <i
                className="fa fa-eye"
                aria-hidden="true"
                type="button"
                id="eye"
                onClick={togglePasswordVisibility}
              ></i>
            </span>
            <br />
            <button type="submit" className="log-in">
              {" "}
              Log In{" "}
            </button>
          </div>

          <div className="other">
            <button className="btn submits frgt-pass">Forgot Password</button>
            <Link to="/signup">
              <button className="btn submits sign-up">
                Sign Up{" "}
                <i className="fa fa-user-plus" aria-hidden="true"></i>
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
