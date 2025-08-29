import React, { useState, useMemo } from 'react';
import CityInput from './CityInput';
import WeatherDisplay from './WeatherDisplay';
import ErrorMessage from './ErrorMessage';
import ForecastDisplay from './ForecastDisplay';
import { WiDaySunny } from 'react-icons/wi';
import './App.css';

const getNextSixDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dates = useMemo(() => getNextSixDates(), []);

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
        `&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,winddirection_10m_dominant` +
        `&start_date=${startDate}&end_date=${endDate}&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      if (!weatherData.daily) {
        setError('Weather data not available');
        return;
      }

      setWeather(weatherData.current_weather);
      setForecast(weatherData.daily);
      setSelectedDay({
        date: weatherData.daily.time[0],
        tempMax: weatherData.daily.temperature_2m_max[0],
        tempMin: weatherData.daily.temperature_2m_min[0],
        weathercode: weatherData.daily.weathercode[0],
        windSpeed: weatherData.daily.windspeed_10m_max[0],
        windDirection: weatherData.daily.winddirection_10m_dominant[0],
      });
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
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
      <header className="app-header">
      <WiDaySunny size={58} color="#0b0f0fff" className="header-icon" />
      <h1 className="app-title">Weather Now</h1>
    </header>

      <div className="input-date-wrapper">
        <CityInput city={city} setCity={setCity} onFetch={() => fetchWeather()} />
        <div className="date-selector">
          <span className="date-selector-label"></span>
          <div className="date-buttons">
            {dates.map((date) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <button
                  key={date.toISOString()}
                  className={`date-button${isSelected ? ' selected pulse' : ''}`}
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
        ? <WeatherDisplay className="animate-fade-in-up" detailedDay={selectedDay} />
        : weather && <WeatherDisplay className="animate-fade-in-up" weather={weather} />}

      {forecast && <ForecastDisplay className="animate-slide-in-up" forecast={forecast} onDayClick={handleDayClick} />}
    </div>
  );
}
