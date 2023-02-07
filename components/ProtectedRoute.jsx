import { Navigate, useNavigate } from "react-router-dom";
import { request, requestWithAuth } from "../lib/random_functions";
import { useContext, useEffect, useState } from "react";
import UserContext from '../lib/usercontext';
import { CircularProgress } from "@mui/material";
import Screen from "./Screen";

export default function ProtectedRoute(props) {

    const navigate = useNavigate();

    const [user, setUser] = useContext(UserContext);
    const [isAuthRequestDone, setIsAuthRequestDone] = useState(false);

    useEffect(() => {
        (async () => {
            let [res, data] = await requestWithAuth(navigate, "/api/auth/user");
            setUser(data);
            setIsAuthRequestDone(true);
        })();
    }, []);

    //return 

    return (
        <>
            {!isAuthRequestDone ?
                <Screen>
                    <CircularProgress />
                </Screen>
                :

                <>
                    {user ?
                        <>
                            {props.children}
                        </>
                        :
                        <Navigate to="/login" />
                    }
                </>

            }
        </>
    );

}
