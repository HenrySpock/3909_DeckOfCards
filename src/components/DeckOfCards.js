import React, { useState, useEffect } from 'react';

function DeckOfCards() {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);  

  useEffect(() => {
    async function loadDeck() {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
      const data = await response.json();
      setDeck(data);
    }
    loadDeck();
  }, []);

  async function drawCard() {
    if (!deck) return;

    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`);
    const data = await response.json();

    if (data.remaining === 0) {
      alert('Error: no cards remaining!');
      return;
    }

    const cardWithRotation = {
      ...data.cards[0],
      rotation: randomRotation() // Assign rotation once here
    };

    setCards(prevCards => [...prevCards, cardWithRotation]);
}

  function randomRotation() {
    return Math.floor(Math.random() * 360);
  }

  return (
    <div className="deck-container">
      <button className="draw-button" onClick={drawCard}>Draw a card</button>
      <div className="cards-container">
        {cards.map(c => (
          <img 
            key={c.code} 
            className="card-image"
            style={{ 
              transform: `rotate(${c.rotation}deg)`
            }} 
            src={c.image} 
            alt={c.code}
          />
        ))}
      </div>
    </div>
);

}

export default DeckOfCards;
