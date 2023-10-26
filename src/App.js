import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from 'scenes/homepage';
import LoginPage from 'scenes/loginpage';
import ProfilePage from 'scenes/profilepage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from './theme';
import React from 'react';


function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); 
  const isAuth =  Boolean (useSelector((state) => state.token)); //to see if the token is null , that means user logged out

  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme= {theme}>
        <CssBaseline/> {/*this is top reset the css back to original */}
        <Routes>
          <Route path='/' element = {<LoginPage />} />
          <Route path='/home' element = {isAuth ? <HomePage /> : <Navigate to="/" />} />
          <Route path='/profile/:userId' element = { isAuth ? <ProfilePage/> : <Navigate to="/" />} />
        </Routes>
      </ThemeProvider> 
      </BrowserRouter>
    </div>
  );
}

export default App;
