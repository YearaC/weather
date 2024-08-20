import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import WeatherBox from "./component/WeatherBox";
import WeatherButton from "./component/WeatherButton";

function App() {
  const [weather, setWeather] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  // `permissionGranted`는 사용되지 않으므로 제거
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

  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, [fetchWeather]);

  const handleAllowThisTime = useCallback(() => {
    setShowPermissionModal(false);
    getCurrentLocation(); // 이제 getCurrentLocation이 정의된 이후에 사용됩니다.
  }, [getCurrentLocation]);

  const handleAllowEveryVisit = useCallback(() => {
    setShowPermissionModal(false);
    localStorage.setItem("locationPermission", "granted");
    getCurrentLocation(); // 이제 getCurrentLocation이 정의된 이후에 사용됩니다.
  }, [getCurrentLocation]);

  const handleDontAllow = useCallback(() => {
    setShowPermissionModal(false);
    // 위치 정보를 가져오지 않음
  }, []);

  useEffect(() => {
    const savedPermission = localStorage.getItem("locationPermission");
    if (savedPermission === "granted") {
      getCurrentLocation();
      setShowPermissionModal(false);
    }
  }, [getCurrentLocation]);

  const getWeatherForLocation = useCallback(async (location) => {
    setSelectedLocation(location); // 선택된 위치 업데이트

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
  }, [getCurrentLocation, fetchWeather]); // 의존성 배열에 getCurrentLocation과 fetchWeather 포함

  return (
    <div>
      <Modal show={showPermissionModal} onHide={() => setShowPermissionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Location Permission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This website would like to access your location to provide weather updates.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDontAllow}>
            Don't Allow
          </Button>
          <Button variant="primary" onClick={handleAllowThisTime}>
            Allow this time
          </Button>
          <Button variant="primary" onClick={handleAllowEveryVisit}>
            Allow on every visit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* WeatherBox와 WeatherButton 같은 컴포넌트를 여기에 추가 */}
      <WeatherBox weather={weather} />
      <WeatherButton onGetWeather={getWeatherForLocation} selectedLocation={selectedLocation} />
    </div>
  );
}

export default App;
