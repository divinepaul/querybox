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
import SearchContext from './lib/searchcontext';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'katex/dist/katex.min.css'
import './lib/random_functions.js';
import AdminUsers from './screens/admin/Users';
import AdminHome from './screens/admin/Home';
import Logout from './screens/Logout';
import { request } from './lib/random_functions.js';
import AdminStaff from './screens/admin/Staff';
import AdminCustomers from './screens/admin/Customers';
import AdminCategories from './screens/admin/Category';
import AdminTopics from './screens/admin/Topics';
import StaffHome from './screens/admin/StaffHome';
import PostQuestion from './screens/user/PostQuestion/PostQuestion';
import AllQuestions from './screens/user/AllQuestions/AllQuestions';
import Question from './screens/user/Question/Question';
import PostAnswer from './screens/user/PostAnswer/PostAnswer';

import AdminAnswers from './screens/admin/Answers';
import AdminQuestions from './screens/admin/Questions';
import AdminFiles from './screens/admin/Files';
import AdminVotes from './screens/admin/Votes';
import AdminComments from './screens/admin/Comments';
import AdminHistory from './screens/admin/History';
import AdminComplaints from './screens/admin/Complaints';

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
    const [search, setSearch] = useState("");

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
                <SearchContext.Provider value={[search, setSearch]}>
                    <UserContext.Provider value={[user, setUser]}>
                        <NavBar />
                        <Routes>
                            <Route path="/" element={<Screen><Home /></Screen>} />
                            <Route path="/login" element={<Screen><Login /></Screen>} />
                            <Route path="/register" element={<Screen><Register /></Screen>} />
                            <Route path="/admin" element={
                                <ProtectedRoute allowedUsers={["admin"]}>
                                    <Screen>
                                        <AdminHome />
                                    </Screen>
                                </ProtectedRoute>} />
                            <Route path="/staff/home" element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <StaffHome />
                                    </Screen>
                                </ProtectedRoute>} />
                            <Route path="/admin/users" exact element={
                                <ProtectedRoute allowedUsers={["admin"]}>
                                    <Screen>
                                        <AdminUsers />
                                    </Screen>
                                </ProtectedRoute>} />
                            <Route path="/admin/staff" exact element={
                                <ProtectedRoute allowedUsers={["admin"]}>
                                    <Screen>
                                        <AdminStaff />
                                    </Screen>
                                </ProtectedRoute>} />

                            <Route path="/admin/customer" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminCustomers />
                                    </Screen>
                                </ProtectedRoute>} />
                            <Route path="/admin/category" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminCategories />
                                    </Screen>
                                </ProtectedRoute>} />

                            <Route path="/admin/topics" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminTopics />
                                    </Screen>
                                </ProtectedRoute>} />

                            <Route path="/admin/questions" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminQuestions />
                                    </Screen>
                                </ProtectedRoute>} />


                            <Route path="/admin/answers" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminAnswers />
                                    </Screen>
                                </ProtectedRoute>} />

                            <Route path="/admin/files" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminFiles />
                                    </Screen>
                                </ProtectedRoute>} />


                            <Route path="/admin/votes" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminVotes />
                                    </Screen>
                                </ProtectedRoute>} />

                            <Route path="/admin/comments" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminComments />
                                    </Screen>
                                </ProtectedRoute>} />

                            <Route path="/admin/history" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminHistory />
                                    </Screen>
                                </ProtectedRoute>} />


                            <Route path="/admin/complaints" exact element={
                                <ProtectedRoute allowedUsers={["admin", "staff"]}>
                                    <Screen>
                                        <AdminComplaints />
                                    </Screen>
                                </ProtectedRoute>} />










                            <Route path="/question/ask/:postNumber/:mode" exact element={
                                <ProtectedRoute allowedUsers={["customer"]}>
                                    <Screen>
                                        <PostQuestion />
                                    </Screen>
                                </ProtectedRoute>} />

                            <Route path="/answer/:postNumber/:mode" exact element={
                                <ProtectedRoute allowedUsers={["customer"]}>
                                    <Screen>
                                        <PostAnswer />
                                    </Screen>
                                </ProtectedRoute>} />

                            <Route path="/question/:postNumber" exact element={
                                <Screen>
                                    <Question />
                                </Screen>} />

                            <Route path="/questions" exact element={
                                <Screen>
                                    <AllQuestions />
                                </Screen>} />

                            <Route path="*" element={<NotFound />} />
                            <Route path="/logout" element={<Logout />} />

                        </Routes>
                    </UserContext.Provider>
                </SearchContext.Provider>
            </BrowserRouter>
        </ThemeProvider>
    );
}
