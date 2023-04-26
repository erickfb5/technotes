import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";


import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSumbit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }

      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePasswordInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <PulseLoader color={'#FFF'} />;

  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>

      <main className="login">
        <p className={errClass} ref={errRef} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSumbit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            className="form__input"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form__input"
            id="password"
            value={password}
            onChange={handlePasswordInput}
            required
          />
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>

      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};

export default Login;
