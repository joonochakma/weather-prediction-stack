import React, { useState } from 'react';
import './Home.css';


function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const API_KEY = '99c7de6dacdf4b50a8613548242310'; // replace whenever key is expired

  const weatherIcons = {
    Sunny: 'sunny.svg',  
    Cloudy: 'cloudy.svg',
    Rainy: 'rainy.svg',  
  };

  const cities = [
    { name: 'Sydney', value: 'Sydney' },
    { name: 'Melbourne', value: 'Melbourne' },
    { name: 'Brisbane', value: 'Brisbane' },
    { name: 'Perth', value: 'Perth' },
    { name: 'Adelaide', value: 'Adelaide' },
    { name: 'Hobart', value: 'Hobart' },
    { name: 'Canberra', value: 'Canberra' },
    { name: 'Darwin', value: 'Darwin' },
  ];

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = async () => {
    if (city) {
      try {
        console.log(`Searching for weather in: ${city}`);
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
        const data = await response.json();

        console.log('API Response:', data);

        if (data.error) {
          setError('City not found. Please try again.');
          setWeatherData(null);
          return;
        }

        // Set weather data with date
        setWeatherData({
          temp_min: data.current.temp_c,
          temp_max: data.current.temp_c,
          weather_state: data.current.condition.text,
          date: data.location.localtime,  // Date from API response
        });
        setError('');
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Error fetching weather data. Please try again later.');
        setWeatherData(null);
      }
    } else {
      setError('Please select a city.');
      setWeatherData(null);
    }
  };

  const getWeatherIcon = (state) => {
    const formattedState = state.toLowerCase();
    if (formattedState.includes('sun')) return weatherIcons.Sunny;
    if (formattedState.includes('cloud')) return weatherIcons.Cloudy;
    if (formattedState.includes('rain')) return weatherIcons.Rainy;
    return null;
  };

  return (
    <div className="home-container">
      <header className="App-header">
        <div className='background'>
          <h1>Australian Cities Weather App</h1>
          <div className="search-bar">
            <select value={city} onChange={handleCityChange}>
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.name}
                </option>
              ))}
            </select>
            <button onClick={handleSearch}>Search</button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {weatherData && (
            <div className="weather-info">
              <p>Date: {new Date(weatherData.date).toLocaleString()}</p> {/* Display date */}
              <p>Temperature: {weatherData.temp_min}°C</p>
              <p className='icon'>
                {getWeatherIcon(weatherData.weather_state) && (
                  <img
                    src={getWeatherIcon(weatherData.weather_state)}
                    alt={weatherData.weather_state}
                    className="weather-icon"
                  />
                )}{' '}
                {weatherData.weather_state}
              </p>
            </div>
          )}
        </div>
      </header>
    </div>
    
  );
  
}

export default Home;
