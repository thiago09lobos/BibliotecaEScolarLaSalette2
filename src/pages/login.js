import { useState, useContext } from "react";
import "./login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-Config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const { dispatch } = useContext(AuthContext)


  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user })
        navigate("/pp/dml/home");
      })
      .catch((error) => {
        setError(true);
      });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Inicia sesion con tu cuenta</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Correo elecrtónico
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Iniciar sesion
          </button>
        </form>
        {error && <div className="error-message">Correo o contraseña incorrenta!</div>}
      </div>
    </div>
  );
};

export default Login;