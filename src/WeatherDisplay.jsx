import React from 'react';
import './WeatherDisplay.css';

// Example icon helpers
const getWeatherTheme = (code) => {
  if (code === 0) return 'clear';
  if ([1,2,3].includes(code)) return 'cloudy';
  if ([45,48,51,53,55,61,63,65].some(c => c === code)) return 'rainy';
  if ([71,73,75].includes(code)) return 'snowy';
  if ([95,96,99].includes(code)) return 'thunderstorm';
  return 'clear';
};

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

export default function WeatherDisplay({ weather, detailedDay, className }) {
  const info = detailedDay || weather;
  if (!info) return null;
  const dateKey = detailedDay ? info.date : info.time;
  const formattedDate = dateKey
    ? new Date(dateKey).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className={`weather-display ${className || ""}`}>
      <div className="weather-main-visual">
        <span className="weather-emoji" role="img" aria-label={getWeatherDescription(info.weathercode)}>
          {getWeatherIcon(info.weathercode)}
        </span>
      </div>
      <h3>{formattedDate}</h3>
      <div className="weather-info-grid">
        <div className="weather-info-item">
          <div className="label">Max Temp</div>
          <div className="value">{info.tempMax ?? info.temperature}°C</div>
        </div>
        <div className="weather-info-item">
          <div className="label">Min Temp</div>
          <div className="value">{info.tempMin ?? "--"}°C</div>
        </div>
        <div className="weather-info-item">
          <div className="label">Wind Speed</div>
          <div className="value">{info.windSpeed ?? info.windspeed ?? "--"} km/h</div>
        </div>
        <div className="weather-info-item">
          <div className="label">Wind Direction</div>
          <div className="value">{info.windDirection ?? info.winddirection ?? "--"}°</div>
        </div>
      </div>
      <div className="weather-condition-box">
        <div>
          <span>Condition</span>
          <br />
          <span style={{ fontWeight: 700, fontSize: "1.1em" }}>
            {getWeatherDescription(info.weathercode)} {getWeatherIcon(info.weathercode)}
          </span>
        </div>
      </div>
    </div>
  );
}
