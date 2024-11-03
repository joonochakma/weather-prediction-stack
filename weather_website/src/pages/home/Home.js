import React, { useState } from "react";
import "./Home.css";
import australianCities from "./australian_cities.json"; // Import the list of Australian cities

function Home() {
  // State variables for managing city input, filtered cities, weather data, and errors
  const [city, setCity] = useState(""); // Current input city
  const [filteredCities, setFilteredCities] = useState([]); // List of cities matching the input
  const [weatherData, setWeatherData] = useState(null); // Weather data for the selected city
  const [forecastData, setForecastData] = useState(null); // 3-day forecast data
  const [error, setError] = useState(""); // Error messages for user feedback
  const [forecastIndex, setForecastIndex] = useState(0); // Index to track the current forecast day

  const API_KEY = "b46fb33a5a464949a51160836242510"; // Your weather API key

  // Mapping of weather conditions to icons
  const weatherIcons = {
    Sunny: "sunny.svg",
    Cloudy: "cloudy.svg",
    Rainy: "rainy.svg",
  };

  // Handle changes in the city input field
  const handleCityInput = (e) => {
    const input = e.target.value; // Get the current input value
    setCity(input); // Update the city state

    // Filter the list of Australian cities based on user input
    const filtered = australianCities.filter((cityName) =>
      cityName.toLowerCase().startsWith(input.toLowerCase())
    );
    setFilteredCities(filtered); // Update the filtered cities state
  };

  // Handle city selection from the dropdown list
  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity); // Set the selected city in the input field
    setFilteredCities([]); // Clear the dropdown suggestions
  };

  // Fetch the 3-day weather forecast for the selected city
  const fetchForecast = async () => {
    if (city) {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`
        );
        const data = await response.json(); // Parse the JSON response

        // Check for errors in the API response
        if (data.error) {
          setError("Error fetching forecast. Please try again."); // Display error message
          setForecastData(null); // Clear any previous forecast data
          return;
        }

        // Store the fetched forecast data and reset the error message
        setForecastData(data.forecast.forecastday);
        setError("");
        setForecastIndex(0); // Reset index to show the first day's forecast
      } catch (error) {
        console.error("Error fetching forecast data:", error); // Log any fetch errors
        setError("Error fetching forecast data. Please try again later."); // Display a user-friendly error message
        setForecastData(null); // Clear any forecast data
      }
    }
  };

  // Get the appropriate weather icon based on the condition
  const getWeatherIcon = (state) => {
    const formattedState = state.toLowerCase(); // Normalize the weather state for comparison
    if (formattedState.includes("sun")) return weatherIcons.Sunny; // Return sunny icon for sunny conditions
    if (formattedState.includes("cloud")) return weatherIcons.Cloudy; // Return cloudy icon for cloudy conditions
    if (formattedState.includes("rain")) return weatherIcons.Rainy; // Return rainy icon for rainy conditions
    return null; // Default case for no matching condition
  };

  // Format the date for display
  const formatDate = (date = new Date()) => {
    const day = date.getDate(); // Extract the day from the date
    const month = date.toLocaleString("default", { month: "short" }); // Get the abbreviated month name
    return `${day} ${month}`; // Return the formatted date
  };

  // Move to the next forecast day
  const handleNext = () => {
    if (forecastData && forecastIndex < forecastData.length - 1) {
      setForecastIndex(forecastIndex + 1); // Increment the index to show the next day
    }
  };

  // Move to the previous forecast day
  const handlePrev = () => {
    if (forecastData && forecastIndex > 0) {
      setForecastIndex(forecastIndex - 1); // Decrement the index to show the previous day
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
              value={city} // Bind the input value to the city state
              onChange={handleCityInput} // Call the handler on input changes
              placeholder="Search for an Australian city or town"
            />
            {filteredCities.length > 0 && ( // Render suggestions if there are any matches
              <ul className="dropdown">
                {filteredCities.slice(0, 5).map((cityName) => (
                  <li key={cityName} onClick={() => handleCitySelect(cityName)}>
                    {cityName} {/* Display each city name in the dropdown */}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={fetchForecast}>Get 3-Day Forecast</button> {/* Button to fetch the forecast */}
          </div>
          {error && <p className="error-message">{error}</p>} {/* Display error message if present */}
          {forecastData && ( // Render forecast data if available
            <div className="forecast-info">
              <h2>3-Day Forecast</h2>
              <div className="carousel">
                <button onClick={handlePrev} disabled={forecastIndex === 0}>
                  Previous {/* Button to go to the previous forecast day */}
                </button>
                <div className="forecast-day">
                  <p className="text-white">
                    {formatDate(new Date(forecastData[forecastIndex].date))} {/* Display the date */}
                  </p>
                  <p className="text-white">
                    Min: {forecastData[forecastIndex].day.mintemp_c}°C {/* Display minimum temperature */}
                  </p>
                  <p className="text-white">
                    Max: {forecastData[forecastIndex].day.maxtemp_c}°C {/* Display maximum temperature */}
                  </p>
                  <p className="icon">
                    <img
                      src={getWeatherIcon(
                        forecastData[forecastIndex].day.condition.text
                      )} // Get and display the weather icon based on conditions
                      alt={forecastData[forecastIndex].day.condition.text}
                      className="weather-icon"
                    />
                    {forecastData[forecastIndex].day.condition.text} {/* Display weather condition text */}
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  disabled={forecastIndex === forecastData.length - 1}
                >
                  Next {/* Button to go to the next forecast day */}
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
