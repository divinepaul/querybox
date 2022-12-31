import { useEffect, useRef } from "react";
import { registerForm } from "../lib/forms";
import Form from "../components/Form/Form";

export default function Register() {
    let ref = useRef();

    let handleSubmit = (values) => {
        console.log('onResponse', values)
    }
    return (
        <>
        <h1>Register</h1>
        <Form ref={ref} formDetails={registerForm} onResponse={handleSubmit} />
        </>
    );
}
