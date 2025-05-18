import { useState } from 'react'
import './App.css'

import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-20 text-center">
        <h1 className="text-3xl font-bold">Welcome to MySite</h1>
      </div>
    </>
  );
}

export default App
