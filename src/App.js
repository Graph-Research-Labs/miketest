import logo from './logo.svg';
import './App.css';
import React from "react";

function App() {
  const customer = document.location.host.split(".")[0];
  return (
    <div className="App">
      <header className="App-header">
        <h1>You came in as {customer}</h1>
      </header>
    </div>
  );
}

export default App;
