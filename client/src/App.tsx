import React from 'react'
import {Navigate, BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import './App.css'

import Chatbox from './components/Chatbox'
import InfoTab from './components/InfoTab'

import { UserDataObject } from './assets/Objects'
import Login from './components/Login'
import Register from './components/Register'


// ----------------------------------- //


function App() {
  const [cUser, setCUser] = React.useState<UserDataObject | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        
        <Route path="/" element={
          cUser !== null ? 
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"></link>

            <div className={"container"}>

              <div className={"container-grid"}>
                <InfoTab />
                <Chatbox />
              </div>
              
            </div>
          </> 
          : (
            // react redirect
            <Navigate to="/login" />
          ) 
        }/>
      </Routes>
    </Router>

  )
}

export default App
