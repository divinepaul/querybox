import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestWithAuth } from "../lib/random_functions";
import UserContext from "../lib/usercontext";

export default function Logout() {

    const [user,setUser] = useContext(UserContext)

    const navigate = useNavigate();
    useEffect(() => {
            requestWithAuth(navigate, "/api/auth/logout",{});
            setUser(null);
            navigate("/login");        
    }, []);
}
