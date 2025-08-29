import React from 'react';
import './ForecastDisplay.css';

function getWeatherDescription(code) {
  if (code === 0) return 'Clear sky (Sunny)';
  if ([1, 2, 3].includes(code)) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55].includes(code)) return 'Drizzling';
  if ([61, 63, 65].includes(code)) return 'Rainy';
  if ([71, 73, 75].includes(code)) return 'Snowy';
  if ([80, 81, 82].includes(code)) return 'Rain showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Unknown';
}
function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55].includes(code)) return "🌦️";
  if ([61, 63, 65].includes(code)) return "🌧️";
  if ([71, 73, 75].includes(code)) return "❄️";
  if ([80, 81, 82].includes(code)) return "🌦️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌈";
}

export default function ForecastDisplay({ forecast, onDayClick }) {
  if (!forecast) return null;
  const { time, temperature_2m_max, temperature_2m_min, weathercode } = forecast;

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">Next 6-Day Forecast</h3>
      <div className="forecast-cards">
        {time.map((date, idx) => (
          <div
            key={date}
            className="forecast-card"
            onClick={() => onDayClick(idx)}
          >
            <div className="forecast-date">
              {new Date(date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div style={{ fontSize: "1.4rem" }}>{getWeatherIcon(weathercode[idx])}</div>
            <div className="forecast-temp">
              Max: {temperature_2m_max[idx]}°C
              <br />
              Min: {temperature_2m_min[idx]}°C
            </div>
            <div className="forecast-condition">{getWeatherDescription(weathercode[idx])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
