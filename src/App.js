import React, { useState } from 'react';
import CityInput from './CityInput';
import WeatherDisplay from './WeatherDisplay';
import ErrorMessage from './ErrorMessage';
import ForecastDisplay from './ForecastDisplay';
import './App.css';

function getNextSixDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
}

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dates = getNextSixDates();

  const fetchWeather = async (date = selectedDate) => {
    setError('');
    setWeather(null);
    setForecast(null);
    setSelectedDay(null);

    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.results?.length) {
        setError('City not found');
        return;
      }
      const { latitude, longitude } = geoData.results[0];

      const startDate = date.toISOString().split('T')[0];
      const endDateObj = new Date(date);
      endDateObj.setDate(endDateObj.getDate() + 5);
      const endDate = endDateObj.toISOString().split('T')[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current_weather=true` +
        `&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,winddirection_10m_dominant` +
        `&start_date=${startDate}&end_date=${endDate}` +
        `&timezone=auto`
      );
      const weatherData = await weatherRes.json();
      if (!weatherData.daily) {
        setError('Weather data not available');
        return;
      }

      setWeather(weatherData.current_weather);
      setForecast(weatherData.daily);

      // Show details for the selected date at index 0
      const idx = 0;
      setSelectedDay({
        date: weatherData.daily.time[idx],
        tempMax: weatherData.daily.temperature_2m_max[idx],
        tempMin: weatherData.daily.temperature_2m_min[idx],
        weathercode: weatherData.daily.weathercode[idx],
        windSpeed: weatherData.daily.windspeed_10m_max[idx],
        windDirection: weatherData.daily.winddirection_10m_dominant[idx],
      });
    } catch {
      setError('Failed to fetch data');
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedDay(null);
    if (city.trim()) fetchWeather(date);
  };

  const handleDayClick = (idx) => {
    if (!forecast) return;
    setSelectedDay({
      date: forecast.time[idx],
      tempMax: forecast.temperature_2m_max[idx],
      tempMin: forecast.temperature_2m_min[idx],
      weathercode: forecast.weathercode[idx],
      windSpeed: forecast.windspeed_10m_max[idx],
      windDirection: forecast.winddirection_10m_dominant[idx],
    });
  };

  return (
    <div className="weather-app-container">
      <h2 className="weather-app-title">Weather Now</h2>

      <div className="input-date-wrapper">
        <CityInput city={city} setCity={setCity} onFetch={() => fetchWeather()} />

        <div className="date-selector">
          <span className="date-selector-label">Select Date:</span>
          <div className="date-buttons">
            {dates.map((date) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <button
                  key={date.toISOString()}
                  className={`date-button${isSelected ? ' selected' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div>{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                  <div>{date.getDate()}/{date.getMonth() + 1}</div>
                  {isToday && <div className="today-label">Today</div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {selectedDay
        ? <WeatherDisplay detailedDay={selectedDay} />
        : weather && <WeatherDisplay weather={weather} />}

      {forecast && <ForecastDisplay forecast={forecast} onDayClick={handleDayClick} />}
    </div>
  );
}
