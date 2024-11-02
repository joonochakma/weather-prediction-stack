import React, { useState } from "react";
import "./Home.css";

function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");
  const [forecastIndex, setForecastIndex] = useState(0);
  const API_KEY = "b46fb33a5a464949a51160836242510"; // replace whenever key is expired

  const weatherIcons = {
    Sunny: "sunny.svg",
    Cloudy: "cloudy.svg",
    Rainy: "rainy.svg",
  };

  const cities = [
    { name: "Sydney", value: "Sydney" },
    { name: "Melbourne", value: "Melbourne" },
    { name: "Brisbane", value: "Brisbane" },
    { name: "Perth", value: "Perth" },
    { name: "Adelaide", value: "Adelaide" },
    { name: "Hobart", value: "Hobart" },
    { name: "Canberra", value: "Canberra" },
    { name: "Darwin", value: "Darwin" },
  ];

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = async () => {
    if (city) {
      try {
        console.log(`Searching for weather in: ${city}`);
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
        );
        const data = await response.json();

        console.log("API Response:", data);

        if (data.error) {
          setError("City not found. Please try again.");
          setWeatherData(null);
          setForecastData(null);
          return;
        }

        // Set current weather data
        setWeatherData({
          temp_min: data.current.temp_c,
          temp_max: data.current.temp_c,
          weather_state: data.current.condition.text,
        });
        setError("");
        setForecastIndex(0); // Reset forecast index
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Error fetching weather data. Please try again later.");
        setWeatherData(null);
      }
    } else {
      setError("Please select a city.");
      setWeatherData(null);
      setForecastData(null);
    }
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

  // Function to format the current date as "Today, 23 Oct"
  const formatDate = (date = new Date()) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" }); // e.g., "Oct"
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
            <button onClick={fetchForecast}>Get 3-Day Forecast</button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {!forecastData && weatherData && (
            <div className="weather-info">
              <p>{formatDate(new Date())}</p> {/* Display today's date */}
              <p>Temperature: {weatherData.temp_min}°C</p>
              <p className="icon">
                {getWeatherIcon(weatherData.weather_state) && (
                  <img
                    src={getWeatherIcon(weatherData.weather_state)}
                    alt={weatherData.weather_state}
                    className="weather-icon"
                  />
                )}{" "}
                {weatherData.weather_state}
              </p>
            </div>
          )}
          {forecastData && (
            <div className="forecast-info">
              <h2>3-Day Forecast</h2>
              <div className="carousel">
                <button onClick={handlePrev} disabled={forecastIndex === 0}>
                  Previous
                </button>
                <div className="forecast-day">
                  <p>
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
