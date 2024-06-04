import React from "react"
import "./App.css"
import InputField from "./InputField"

const App: React.FC = () => {
  return (
    <div className="text-green-500 text-center bg-gray1">
      <h1 className="text-2xl py-10">
        Guess the beat!
      </h1>
      <InputField />
    </div>
  )
}


export default App
