import axios from 'axios';

const sydneyMockWeatherData = {
  coord: { lon: 151.2122, lat: -33.8668 },
  weather: [{
    id: 800, main: 'Clear', description: 'clear sky', icon: '01n',
  }],
  base: 'stations',
  main: {
    temp: 284.96,
    feels_like: 283.84,
    temp_min: 279.47,
    temp_max: 288.07,
    pressure: 1015,
    humidity: 63,
  },
  visibility: 10000,
  wind: { speed: 1.34, deg: 313, gust: 2.68 },
  clouds: { all: 0 },
  dt: 1627638496,
  sys: {
    type: 2, id: 2018875, country: 'AU', sunrise: 1627591756, sunset: 1627629223,
  },
  timezone: 36000,
  id: 6619279,
  name: 'Sydney',
  cod: 200,
};

const mockGetlocationSuccess = () => {
  global.navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) => {
    return Promise.resolve(success({
      coords: {
        latitude: 51.1,
        longitude: 45.3,
      },
    }));
  });
};

const mockGetlocationError = () => {
  global.navigator.geolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
    return Promise.resolve(error({
      code: 1,
      message: 'GeoLocation Error',
    }));
  });
};

const mockAxiosGetSuccess = (data) => {
  axios.get.mockImplementationOnce(() => Promise.resolve({ data }));
};

const mockAxiosGetError = () => {
  axios.get.mockImplementationOnce(() => Promise.reject({ msg: 'error' }));
};

export {
  mockGetlocationSuccess,
  mockGetlocationError,
  mockAxiosGetSuccess,
  mockAxiosGetError,
  sydneyMockWeatherData,
};
