import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Form from "../components/Form/Form";
import { loginForm } from "../lib/forms";


//async function getData(){
    //let res = await fetch("/api/hello");
    //let obj = await res.json();
    //console.log(obj);
//}

export default function Login() {
    let ref = useRef();

    let handleSubmit = (values) => {
        console.log('onResponse', values)

    }
    return (
        <>
        <h1>Login</h1>
        <Form ref={ref} formDetails={loginForm} onResponse={handleSubmit} />
        </>
    );
}
