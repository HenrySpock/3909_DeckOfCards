// Part 1.

// import React, { useState, useEffect } from 'react';

// function DeckOfCards() {
//   const [deck, setDeck] = useState(null);
//   const [cards, setCards] = useState([]);  

//   useEffect(() => {
//     async function loadDeck() {
//       const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
//       const data = await response.json();
//       setDeck(data);
//     }
//     loadDeck();
//   }, []);

//   async function drawCard() {
//     if (!deck) return;

//     const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`);
//     const data = await response.json();

//     if (data.remaining === 0) {
//       alert('Error: no cards remaining!');
//       return;
//     }

//     const cardWithRotation = {
//       ...data.cards[0],
//       rotation: randomRotation() // Assign rotation once here
//     };

//     setCards(prevCards => [...prevCards, cardWithRotation]);
// }

//   function randomRotation() {
//     return Math.floor(Math.random() * 360);
//   }

//   return (
//     <div className="deck-container">
//       <button className="draw-button" onClick={drawCard}>Draw a card</button>
//       <div className="cards-container">
//         {cards.map(c => (
//           <img 
//             key={c.code} 
//             className="card-image"
//             style={{ 
//               transform: `rotate(${c.rotation}deg)`
//             }} 
//             src={c.image} 
//             alt={c.code}
//           />
//         ))}
//       </div>
//     </div>
// );

// }

// export default DeckOfCards;

// Part 2.

import React, { useState, useEffect, useRef } from 'react'; // Import useRef

function DeckOfCards() {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const deckExhaustedRef = useRef(false);

  
  const drawInterval = useRef(); // Use a ref instead of a variable

  useEffect(() => {
    async function loadDeck() {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
      const data = await response.json();
      setDeck(data);
    }
    loadDeck();
  }, []);

  useEffect(() => {
    loadDeck();
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(drawInterval.current);
    }
  }, []);

  async function loadDeck() {
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
    const data = await response.json();
    setDeck(data);
    deckExhaustedRef.current = false;
    setCards([]);
  }

  async function drawCard() {
    if (!deck) return;

    if (!isDrawing) {
      setIsDrawing(true);
      drawInterval.current = setInterval(async () => {
        if(deckExhaustedRef.current) return;

        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`);
        const data = await response.json();

        if (data.remaining === 0) {
          clearInterval(drawInterval.current);
          setIsDrawing(false);
          deckExhaustedRef.current = true;
          alert('Error: no cards remaining!');
          loadDeck(); // Reload the deck after it's exhausted
          return;
        }

        setCards(prevCards => [...prevCards, { ...data.cards[0], rotation: Math.floor(Math.random() * 360) }]);
      }, 300);
    } else {
      clearInterval(drawInterval.current);
      setIsDrawing(false);
      deckExhaustedRef.current = false;
    }
  }

  return (
    <div className="deck-container">
      <button className="draw-button" onClick={drawCard}>
        {isDrawing ? 'Stop drawing' : 'Start drawing'}
      </button>
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
