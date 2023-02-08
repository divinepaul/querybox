import { useContext, useEffect, useRef } from "react";
import { registerForm } from "../lib/forms";
import Form from "../components/Form/Form";
import './Login/Login.css';
import UserContext from "../lib/usercontext";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    let ref = useRef();
    let handleSubmit = (values) => {
        let user = values.user;
        setUser(user);
        navigate("/user/ask");
    }
    return (
        <div className="auth-container">
        <h1>Register</h1>
        <br/>
        <br/>
        <Form ref={ref} formDetails={registerForm} onResponse={handleSubmit} />
        </div>
    );
}
