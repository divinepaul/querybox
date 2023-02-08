import React from 'react'
//import { BrowserRouter, Routes, Route } from "react-router-dom";
//import { createTheme, ThemeProvider } from '@mui/material/styles';
//const { palette } = createTheme();
//const { augmentColor } = palette;
//const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
//import './assets/css/index.css'
import ReactDOM from 'react-dom/client'
//import Home from './screens/Home/Home';
//import Login from './screens/Login/Login';
//import Register from './screens/Register';
//import NavBar from './components/NavBar/NavBar';
//import Screen from './components/Screen';
//import ProtectedRoute from './components/ProtectedRoute';
//import NotFound from './screens/NotFound';
//import './lib/constants.js';
//import UserContext from './lib/usercontext';

//import '@fontsource/roboto/300.css';
//import '@fontsource/roboto/400.css';
//import '@fontsource/roboto/500.css';
//import '@fontsource/roboto/700.css';
//import './lib/random_functions.js';
import App from '../App';

//const theme = createTheme({
    //palette: {
        //white: createColor('#ffffff'),
        //primary: {
            //main: '#7d3aa8',
        //},
    //},
//});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)
