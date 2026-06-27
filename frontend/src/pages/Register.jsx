import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {

    const [form, setForm] =
        useState({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: ""
        });

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const navigate = useNavigate();

    const updateField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        });
    };

    const submit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {

            await API.post(
                "/auth/register",
                form
            );

            navigate("/login");

        } catch (err) {

            setMessage(
                err.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-page">

            <section className="auth-card wide">

                <Link className="auth-brand" to="/">
                    amazon<span>.clone</span>
                </Link>

                <h1>Create account</h1>

                {message && (
                    <div className="notice error compact">
                        {message}
                    </div>
                )}

                <form className="auth-form" onSubmit={submit}>

                    <label>
                        Your name
                        <input
                            placeholder="First and last name"
                            value={form.name}
                            onChange={(e) =>
                                updateField("name", e.target.value)
                            }
                            required
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) =>
                                updateField("email", e.target.value)
                            }
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            placeholder="At least 6 characters"
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                updateField("password", e.target.value)
                            }
                            required
                        />
                    </label>

                    <label>
                        Phone
                        <input
                            placeholder="Mobile number"
                            value={form.phone}
                            onChange={(e) =>
                                updateField("phone", e.target.value)
                            }
                        />
                    </label>

                    <label>
                        Address
                        <textarea
                            placeholder="House number, street and city"
                            value={form.address}
                            onChange={(e) =>
                                updateField("address", e.target.value)
                            }
                        />
                    </label>

                    <button
                        className="primary-button full-width"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create your account"}
                    </button>

                </form>

                <p className="auth-note">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>

            </section>

        </div>

    );

}

export default Register;
