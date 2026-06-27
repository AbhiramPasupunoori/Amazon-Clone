import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import API from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {

            const res = await API.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            login(
                res.data.token,
                res.data.user
            );

            navigate("/");

        } catch (err) {

            setMessage(
                err.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-page">

            <section className="auth-card">

                <Link className="auth-brand" to="/">
                    amazon<span>.clone</span>
                </Link>

                <h1>Sign in</h1>

                {message && (
                    <div className="notice error compact">
                        {message}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>

                    <label>
                        Email
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </label>

                    <button
                        className="primary-button full-width"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Continue"}
                    </button>

                </form>

                <p className="auth-note">
                    New to Amazon Clone?
                </p>

                <Link className="secondary-button full-width" to="/register">
                    Create your account
                </Link>

            </section>

        </div>

    );

}

export default Login;
