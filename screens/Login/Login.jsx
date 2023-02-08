import { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "../../components/Form/Form";
import { loginForm } from "../../lib/forms";
import { request, requestWithAuth } from "../../lib/random_functions";
import UserContext from "../../lib/usercontext";
import './Login.css';

//async function getData(){
//let res = await fetch("/api/hello");
//let obj = await res.json();
//console.log(obj);
//}

export default function Login() {

    const navigate = useNavigate();

    let ref = useRef();

        //(async () => {
            //await requestWithAuth(navigate, "/api/auth/user");
        //})();
    //useEffect(() => {
    //},)

    const [user, setUser] = useContext(UserContext);

    let handleSubmit = async (values) => {
        console.log(values);
        let user = values.user;
        //let [_, data] = await requestWithAuth(navigate, "/api/auth/user");
        setUser(user);
        if(user.type=="admin"){
            navigate("/admin");
        } else if(user.type == "staff"){
            navigate("/staff/home");
        } else  {
            navigate("/user/ask");
        }
    }

    return (
        <div className="auth-container">
            <h1>Login</h1>
            <br />
            <br />
            <br />
            <Form ref={ref} formDetails={loginForm} onResponse={handleSubmit} />
        </div>
    );
}
