import { useState } from "react";
import API from "../services/api";

function Register() {

    const [form, setForm] =
        useState({});

    const submit = async (e) => {

        e.preventDefault();

        await API.post(
            "/auth/register",
            form
        );

        alert(
            "Registration successful"
        );

    };

    return (

        <form onSubmit={submit}>

            <input
                placeholder="Name"
                onChange={(e) =>
                    setForm({
                        ...form,
                        name: e.target.value
                    })
                }
            />

            <input
                placeholder="Email"
                onChange={(e) =>
                    setForm({
                        ...form,
                        email: e.target.value
                    })
                }
            />

            <input
                placeholder="Password"
                type="password"
                onChange={(e) =>
                    setForm({
                        ...form,
                        password:
                            e.target.value
                    })
                }
            />

            <button>
                Register
            </button>

        </form>

    );

}

export default Register;