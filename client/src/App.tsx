import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BattleInterface from './pages/Arena'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BattleInterface />
    </>
  )
}

export default App
