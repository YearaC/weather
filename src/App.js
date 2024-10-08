import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import WeatherBox from "./component/WeatherBox";
import WeatherButton from "./component/WeatherButton";

function App() {
  const [weather, setWeather] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('current');
  const [permissionRequested, setPermissionRequested] = useState(false);

  const fetchWeather = useCallback(async (lat, lon) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9fbf737bf2d4ad02dfd09637c45abe0f&units=metric`;
      let response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      let data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [fetchWeather]);

  const handleAllow = useCallback(() => {
    setPermissionRequested(true);
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    const savedPermission = localStorage.getItem("locationPermission");
    if (savedPermission === "granted") {
      getCurrentLocation();
    } else if (!permissionRequested) {
      handleAllow(); // Automatically request permission if not yet requested
    }
  }, [getCurrentLocation, handleAllow, permissionRequested]);

  const getWeatherForLocation = useCallback(async (location) => {
    setSelectedLocation(location);

    try {
      let locations = {
        'Paris': { lat: 48.8566, lon: 2.3522 },
        'Jeju': { lat: 33.5098, lon: 126.5247 }
      };

      if (location === 'current') {
        await getCurrentLocation();
      } else if (locations[location]) {
        let { lat, lon } = locations[location];
        await fetchWeather(lat, lon);
      }
    } catch (error) {
      console.error('Error getting weather for location:', error);
    }
  }, [getCurrentLocation, fetchWeather]);

  return (
    <div>
      {/* Optionally, add a UI element to instruct users to allow location access */}
      <div className="container">
        <WeatherBox weather={weather} />
        <WeatherButton 
          onGetWeather={getWeatherForLocation} 
          selectedLocation={selectedLocation} 
        />
      </div>
    </div>
  );
}

export default App;
