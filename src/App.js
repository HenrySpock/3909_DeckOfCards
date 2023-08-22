import React from 'react';
import './App.css'; 
import DeckOfCards from './components/DeckOfCards';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Deck of Cards</h1>
      </header>
      <main className="App-content">
        <DeckOfCards />
      </main>
    </div>
  );
}

export default App;
