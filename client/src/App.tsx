import React from 'react'
import {Navigate, BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import './App.css'

import Chatbox from './components/Chatbox'
import InfoTab from './components/InfoTab'

import { UserDataObject } from './assets/Objects'
import Login from './components/Login'
import Register from './components/Register'
import RecipesAI from './components/RecipesAI';

// ----------------------------------- //


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<RecipesAI/>}/>
      </Routes>
    </Router>

  )
}

export default App
