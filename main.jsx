import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
import './assets/css/index.css'
import ReactDOM from 'react-dom/client'
import Home from './screens/Home/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import NavBar from './components/NavBar/NavBar';
import Screen from './components/Screen';
import NotFound from './screens/NotFound';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
    palette: {
        white: createColor('#ffffff'),
        primary: {
            main: '#7d3aa8',
        },
    },
});
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Screen><Home /></Screen>} />
                    <Route path="/login" element={<Screen><Login /></Screen>} />
                    <Route path="/register" element={<Screen><Register /></Screen>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
)
