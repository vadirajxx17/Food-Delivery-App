import { useRef, useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({ setLoginStatus, setCname, setUsername }) {
    const login = useRef(null);
    const password = useRef(null);

    const [status, setStatus] = useState("");

    const authenticateUser = async () => {
        const username = login.current.value;
        const userPassword = password.current.value;
        console.log("Username:", username);
        console.log("Password:", userPassword);
        try {
            const response = await axios.post(
                "http://localhost:9000/api/user/authenticate",
                {
                    user: username,
                    password: userPassword
                    
                }
            );

            if (response.data.length > 0) {
                const user = response.data[0];
                setLoginStatus(true);
                setStatus("Welcome");
                setCname(user.cname);
                setUsername(user.username);
            } else {
                setStatus("Invalid Login");
            }
        } catch (error) {
            console.error("Login error:", error);
            setStatus("Unable to connect to the server");
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Login to continue to your account</p>
                </div>

                <div className="login-form">

                    <div className="input-group">
                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            ref={login}
                            type="text"
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            ref={password}
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        className="login-button"
                        onClick={authenticateUser}
                    >
                        Login
                    </button>

                </div>

                {status && (
                    <p
                        className={
                            status === "Welcome"
                                ? "login-status success"
                                : "login-status error"
                        }
                    >
                        {status}
                    </p>
                )}

            </div>

        </div>
    );
}

export default Login;
