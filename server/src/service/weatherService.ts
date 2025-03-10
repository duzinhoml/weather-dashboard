import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  async getCoordinates(city: string) {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );

      if (response.data.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon } = response.data[0];
      return { lat, lon };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw new Error('Failed to fetch coordinates');
    }
  }

  async getWeather(lat: number, lon: number) {
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const { name } = response.data.city;
      const { list } = response.data;

      const currentWeather = {
        city: name,
        date: new Date(list[0].dt * 1000).toLocaleDateString(),
        icon: list[0].weather[0].icon,
        iconDescription: list[0].weather[0].description,
        tempF: parseFloat(((list[0].main.temp * 9) / 5 + 32).toFixed(1)),
        windSpeed: list[0].wind.speed,
        humidity: list[0].main.humidity,
      };

      const forecast = list.slice(1).map((item: any) => ({
        date: new Date(item.dt * 1000).toLocaleDateString(),
        icon: item.weather[0].icon,
        iconDescription: item.weather[0].description,
        tempF: parseFloat(((item.main.temp * 9) / 5 + 32).toFixed(1)),
        windSpeed: item.wind.speed,
        humidity: item.main.humidity,
      }));

      return [currentWeather, ...forecast];
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
}

export default new WeatherService();
