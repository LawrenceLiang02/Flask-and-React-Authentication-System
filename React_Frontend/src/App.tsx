import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Channel from './Components/channel'

function App() {
  const [initialState, setState] = useState([])
  const url = "http://127.0.0.1:80/api"

  useEffect(()=> {
    fetch(url).then(response => {
      if (response.status == 200) {
        return response.json()
      }
    }).then(data => setState(data))
  }, [])

  return (
    <div className="App">
      <h1>Test hahaha test</h1>
      <Channel data={initialState}></Channel>
    </div>
  );
}

export default App;
