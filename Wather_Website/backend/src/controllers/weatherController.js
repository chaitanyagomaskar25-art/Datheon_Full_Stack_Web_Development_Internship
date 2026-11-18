import { fetchWeatherFromApi } from '../services/openWeatherService.js';
import { SearchHistory } from '../models/SearchHistory.js';
import { isDbConnected } from '../config/db.js';

export const getWeather = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;

    // Empty search validation
    if (!city && (lat === undefined || lon === undefined)) {
      return res.status(400).json({
        success: false,
        errorType: 'EMPTY_QUERY',
        message: 'Please enter a city name to search.',
      });
    }

    if (city !== undefined && !city.trim()) {
      return res.status(400).json({
        success: false,
        errorType: 'EMPTY_QUERY',
        message: 'Please enter a valid city name.',
      });
    }

    const params = city ? { q: city.trim() } : { lat: Number(lat), lon: Number(lon) };
    const weatherData = await fetchWeatherFromApi(params);

    // Asynchronously log to SearchHistory if database is connected
    if (isDbConnected() && weatherData.current) {
      SearchHistory.create({
        query: city ? city.trim() : `${lat},${lon}`,
        cityName: weatherData.current.city,
        country: weatherData.current.country,
        lat: weatherData.current.coord?.lat,
        lon: weatherData.current.coord?.lon,
        temp: weatherData.current.temp,
        condition: weatherData.current.condition?.main,
      }).catch((err) => console.warn('[SearchHistory] Log failed:', err.message));
    }

    return res.status(200).json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    next(error);
  }
};
