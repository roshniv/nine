import React, { useEffect, useState } from 'react';
import './Widget.scss';
import { MoonLoader } from 'react-spinners';
import axios from 'axios';
import Day from './icons/day.svg';
import Rainy from './icons/rainy.svg';
import Snowy from './icons/snowy.svg';

interface IWeather {
    name: string,
    main: {
        temp: number
    },
    wind: {
        speed: number,
        deg: number
    },
    weather: {
        main: string
    }[]
}

interface IWeatherProps {
    isCelsius: boolean,
    showWind: boolean
}

const geoOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

const Widget = ({ isCelsius, showWind }: IWeatherProps): React.ReactElement => {
  const [weatherData, setWeatherData] = useState({} as IWeather);
  const [error, setError] = useState(false as boolean);
  const [loading, setLoading] = useState(true as boolean);

  // fetch weather and geo data when load component
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${'ee7405469955e124ef77214a739627c5'}`)
        .then((res) => {
          setWeatherData(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }, () => {
      setError(true);
      setLoading(false);
    }, geoOptions);
  }, []);

  const calculateTemperature = () => {
    const { temp } = weatherData.main;
    const f = Math.round((temp - 273.15) * 9 / 5 + 32);
    const c = Math.round(temp - 273.15);
    return isCelsius ? c : f;
  };

  const weatherImageSrc = () => {
    let imgSrc;
    switch (weatherData.weather[0].main) {
      case 'Rain':
        imgSrc = Rainy;
        break;
      case 'Snow':
        imgSrc = Snowy;
        break;
      default:
        imgSrc = Day;
    }
    return imgSrc;
  };

  const renderWind = () => {
    if (showWind) {
      const windDegVal = Math.round((weatherData.wind.deg / 22.5) + 0.5);
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const direction = directions[(windDegVal % 16)];
      const windSpeed = Math.round(weatherData.wind.speed);
      return (
        <>
          <span className="widget__wind-status">Wind</span>
          <span className="widget__wind-info">
            {direction}
            {' '}
            {windSpeed}
            km/h
          </span>
        </>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="widget__loading" data-testid="loading">
          <MoonLoader color="black" loading={loading} size={48} />
        </div>
      );
    } if (error) {
      return (
        <>
          <p>Please try later</p>
        </>
      );
    }
    return (
      <>
        <img src={weatherImageSrc()} aria-label="weather-icon" alt="weather" className="widget__weather-img" />
        <div className="widget__weather-info" data-testid="widget-info">
          <div className="widget__city">{weatherData.name}</div>
          <div className="widget__temperature">
            {calculateTemperature()}
            &#176;
          </div>
          <div className="widget__wind" data-testid="widget-wind">
            {renderWind()}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="widget">
      <div className="widget__title" data-testid="widget-title">TITLE</div>
      <div className="widget__content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Widget;
