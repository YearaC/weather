import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import WeatherBox from "./component/WeatherBox";
import WeatherButton from "./component/WeatherButton";

function App() {
  const [weather, setWeather] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('current');

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

  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=9fbf737bf2d4ad02dfd09637c45abe0f`;
      let response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      let data = await response.json();
      console.log("Reverse Geocode Data:", data);
    } catch (error) {
      console.error('Failed to fetch reverse geocode data:', error);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        try {
          await fetchWeather(lat, lon);
          await reverseGeocode(lat, lon);
        } catch (error) {
          console.error('Error fetching weather or reverse geocode data:', error);
        }
      }, (error) => {
        console.error('Geolocation error:', error);
      });
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  }, [fetchWeather, reverseGeocode]);

  const getWeatherForLocation = useCallback(async (location) => {
    setSelectedLocation(location); // Update selected location

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

  useEffect(() => {
    try {
      getCurrentLocation();
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [getCurrentLocation]);

  return (
    <div>
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
