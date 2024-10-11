
import './App.css'

import Chatbox from './components/Chatbox'
import InfoTab from './components/InfoTab'

function App() {

  return (
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

  )
}

export default App
