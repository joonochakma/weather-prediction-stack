import React, { useState } from "react";
import "./Home.css";
import australianCities from "./australian_cities.json"; // Import the list of cities and towns

function Home() {
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");
  const [forecastIndex, setForecastIndex] = useState(0);
  const API_KEY = "b46fb33a5a464949a51160836242510"; // Replace with your actual API key

  const weatherIcons = {
    Sunny: "sunny.svg",
    Cloudy: "cloudy.svg",
    Rainy: "rainy.svg",
  };

  const handleCityInput = (e) => {
    const input = e.target.value;
    setCity(input);

    // Filter cities based on input
    const filtered = australianCities.filter((cityName) =>
      cityName.toLowerCase().startsWith(input.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setFilteredCities([]); // Hide suggestions after selecting
  };

  const fetchForecast = async () => {
    if (city) {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`
        );
        const data = await response.json();

        if (data.error) {
          setError("Error fetching forecast. Please try again.");
          setForecastData(null);
          return;
        }

        setForecastData(data.forecast.forecastday);
        setError("");
        setForecastIndex(0); // Reset index to show the first day
      } catch (error) {
        console.error("Error fetching forecast data:", error);
        setError("Error fetching forecast data. Please try again later.");
        setForecastData(null);
      }
    }
  };

  const getWeatherIcon = (state) => {
    const formattedState = state.toLowerCase();
    if (formattedState.includes("sun")) return weatherIcons.Sunny;
    if (formattedState.includes("cloud")) return weatherIcons.Cloudy;
    if (formattedState.includes("rain")) return weatherIcons.Rainy;
    return null;
  };

  const formatDate = (date = new Date()) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };

  const handleNext = () => {
    if (forecastData && forecastIndex < forecastData.length - 1) {
      setForecastIndex(forecastIndex + 1);
    }
  };

  const handlePrev = () => {
    if (forecastData && forecastIndex > 0) {
      setForecastIndex(forecastIndex - 1);
    }
  };

  return (
    <div className="home-container">
      <header className="App-header">
        <div className="background">
          <h1>Australian Cities Weather App</h1>
          <div className="search-bar-container">
            <input
              type="text"
              value={city}
              onChange={handleCityInput}
              placeholder="Search for an Australian city or town"
            />
            {filteredCities.length > 0 && (
              <ul className="dropdown">
                {filteredCities.slice(0, 5).map((cityName) => (
                  <li key={cityName} onClick={() => handleCitySelect(cityName)}>
                    {cityName}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={fetchForecast}>Get 3-Day Forecast</button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {forecastData && (
            <div className="forecast-info">
              <h2>3-Day Forecast</h2>
              <div className="carousel">
                <button onClick={handlePrev} disabled={forecastIndex === 0}>
                  Previous
                </button>
                <div className="forecast-day">
                  <p className="text-white">
                    {formatDate(new Date(forecastData[forecastIndex].date))}
                  </p>
                  <p className="text-white">
                    Min: {forecastData[forecastIndex].day.mintemp_c}°C
                  </p>
                  <p className="text-white">
                    Max: {forecastData[forecastIndex].day.maxtemp_c}°C
                  </p>
                  <p className="icon">
                    <img
                      src={getWeatherIcon(
                        forecastData[forecastIndex].day.condition.text
                      )}
                      alt={forecastData[forecastIndex].day.condition.text}
                      className="weather-icon"
                    />
                    {forecastData[forecastIndex].day.condition.text}
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  disabled={forecastIndex === forecastData.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Home;
