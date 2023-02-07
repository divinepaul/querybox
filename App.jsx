import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
import './assets/css/index.css'
import ReactDOM from 'react-dom/client'
import Home from './screens/Home/Home';
import Login from './screens/Login/Login';
import Register from './screens/Register';
import NavBar from './components/NavBar/NavBar';
import Screen from './components/Screen';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './screens/NotFound';
import './lib/constants.js';
import UserContext from './lib/usercontext';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './lib/random_functions.js';
import AdminUsers from './screens/admin/Users';
import AdminHome from './screens/admin/Home';
import Logout from './screens/Logout';
import { request } from './lib/random_functions.js';
import AdminStaff from './screens/admin/Staff';
import AdminCustomers from './screens/admin/Customers';
import AdminCategories from './screens/admin/Category';
import AdminTopics from './screens/admin/Topics';

const theme = createTheme({
    palette: {
        white: createColor('#ffffff'),
        green: createColor('#46e619'),
        primary: {
            main: '#7d3aa8',
        },
    },
});

export default function App() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            let [res, data] = await request("/api/auth/user");
            if (res.status == 200) {
                setUser(data);
            }
        })();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <UserContext.Provider value={[user, setUser]}>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<Screen><Home /></Screen>} />
                        <Route path="/login" element={<Screen><Login /></Screen>} />
                        <Route path="/register" element={<Screen><Register /></Screen>} />

                        <Route path="/hey" element={<><Outlet/></>}>
                            <Route path="/ok" element={<h1>ok</h1>}/>
                        </Route>

                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <Screen>
                                    <AdminHome />
                                </Screen>
                            </ProtectedRoute>} />
                        <Route path="/admin-users" exact element={
                            <ProtectedRoute>
                                <Screen>
                                    <AdminUsers />
                                </Screen>
                            </ProtectedRoute>} />
                        <Route path="/admin-staff" exact element={
                            <ProtectedRoute>
                                <Screen>
                                    <AdminStaff />
                                </Screen>
                            </ProtectedRoute>} />

                        <Route path="/admin-customer" exact element={
                            <ProtectedRoute>
                                <Screen>
                                    <AdminCustomers />
                                </Screen>
                            </ProtectedRoute>} />

                        <Route path="/admin-category" exact element={
                            <ProtectedRoute>
                                <Screen>
                                    <AdminCategories />
                                </Screen>
                            </ProtectedRoute>} />


                        <Route path="/admin-topics" exact element={
                            <ProtectedRoute>
                                <Screen>
                                    <AdminTopics />
                                </Screen>
                            </ProtectedRoute>} />

                        <Route path="*" element={<NotFound />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </UserContext.Provider>
            </BrowserRouter>
        </ThemeProvider>
    );
}
