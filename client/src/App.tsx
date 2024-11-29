import React from 'react'
import {Navigate, BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import './App.css'

import Login from './components/Login'
import Register from './components/Register'
import RecipesAI from './components/RecipesAI';


import { GoogleOAuthProvider } from '@react-oauth/google'


// ----------------------------------- //


function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.REACT_APP_GOOGLE_AUTH_KEY}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<RecipesAI/>}/>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
    

  )
}

export default App
