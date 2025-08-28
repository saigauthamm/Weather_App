import React from 'react';
import './WeatherDisplay.css';

export default function WeatherDisplay({ weather, detailedDay }) {
  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear sky (Sunny) ☀️';
    if ([1, 2, 3].includes(code)) return 'Cloudy ☁️';
    if ([45, 48].includes(code)) return 'Foggy 🌫️';
    if ([51, 53, 55].includes(code)) return 'Drizzling 🌦️';
    if ([61, 63, 65].includes(code)) return 'Rainy 🌧️';
    if ([71, 73, 75].includes(code)) return 'Snowy ❄️';
    if ([80, 81, 82].includes(code)) return 'Rain showers 🌦️';
    if ([95, 96, 99].includes(code)) return 'Thunderstorm ⛈️';
    return 'Unknown';
  };

  const info = detailedDay || weather;
  if (!info) return null;

  const displayDate = info.date || info.time;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : 'Date N/A';

  return (
    <div className="weather-display">
      <h3 className="weather-display-date">{formattedDate}</h3>
      <div className="weather-display-grid">
        <div className="weather-display-item">
          <span className="label">Max Temp</span>
          <span className="value">{info.tempMax ?? info.temperature}°C</span>
        </div>
        {info.tempMin !== undefined && (
          <div className="weather-display-item">
            <span className="label">Min Temp</span>
            <span className="value">{info.tempMin}°C</span>
          </div>
        )}
        <div className="weather-display-item">
          <span className="label">Wind Speed</span>
          <span className="value">{info.windSpeed ?? info.windspeed} km/h</span>
        </div>
        <div className="weather-display-item">
          <span className="label">Wind Direction</span>
          <span className="value">{info.windDirection ?? info.winddirection}°</span>
        </div>
        <div className="weather-display-item full-width">
          <span className="label">Condition</span>
          <span className="value">{getWeatherDescription(info.weathercode)}</span>
        </div>
      </div>
    </div>
  );
}
