import React from 'react';
import './CityInput.css';

export default function CityInput({ city, setCity, onFetch }) {
  return (
    <div className="city-input-container">
      <input
        type="text"
        className="city-input-field"
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Enter a city name"
        aria-label="City name"
      />
      <button className="city-input-button" onClick={onFetch}>
        Get weather
      </button>
    </div>
  );
}
