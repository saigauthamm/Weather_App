import React from 'react';
import './CityInput.css';

export default function CityInput({ city, setCity, onFetch }) {
  return (
    <div className="city-input-container">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city name"
        className="city-input-field"
      />
      <button onClick={onFetch} className="city-input-button">
        Get Weather
      </button>
    </div>
  );
}
