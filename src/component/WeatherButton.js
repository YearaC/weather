import React from 'react';
import Button from 'react-bootstrap/Button';

const WeatherButton = ({ onGetWeather, selectedLocation }) => {
  return (
    <div>
      <Button 
        variant={selectedLocation === 'current' ? 'primary' : 'info'} 
        onClick={() => onGetWeather('current')}
      >
        Current Location
      </Button>
      <Button 
        variant={selectedLocation === 'Paris' ? 'primary' : 'info'} 
        onClick={() => onGetWeather('Paris')}
      >
        Paris
      </Button>
      <Button 
        variant={selectedLocation === 'Jeju' ? 'primary' : 'info'} 
        onClick={() => onGetWeather('Jeju')}
      >
        Jeju
      </Button>
    </div>
  );
};

export default WeatherButton;
