import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const WeatherBox = ({ weather }) => {
  if (!weather) {
    return (
      <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const cityName = weather?.name || "Unknown Location";
  const country = weather?.sys?.country || "";
  const temperatureCelsius = weather?.main?.temp ? weather.main.temp.toFixed(1) : ""; // Format to one decimal place
  const temperatureFahrenheit = temperatureCelsius ? Math.round((parseFloat(temperatureCelsius) * 9/5) + 32) : "";

  // Combine city and country for more precise location info
  const fullLocation = `${cityName}, ${country}`;

  return (
    <div className='weather-box'>
      <div>{fullLocation}</div>
      <h2>{temperatureCelsius}°C / {temperatureFahrenheit}°F</h2>
      <h3>{weather?.weather[0]?.description}</h3>
    </div>
  );
};

export default WeatherBox;
