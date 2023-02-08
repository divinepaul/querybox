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
            setIsAuthRequestDone(true);
    }, []);

    //return 

    return (
        <>
            {!user ?
                <Screen>
                    <CircularProgress />
                </Screen>
                :

                <>
                    {props.allowedUsers.includes(user.type) ?
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
