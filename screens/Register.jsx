import { useEffect, useRef } from "react";
import { registerForm } from "../lib/forms";
import Form from "../components/Form/Form";
import './Login/Login.css';

export default function Register() {
    let ref = useRef();
    let handleSubmit = (values) => {
        // TODO navigate to questions list
        console.log('onResponse', values)
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
