import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import { v4 as uuidv4 } from 'uuid';
import WeatherService from '../../service/weatherService.js';

router.post('/', async (req: Request, res: Response) => {
  const city = req.body.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // Get coordinates from city name
    const coordinates = await WeatherService.getCoordinates(city);

    // Get weather data from coordinates
    const weatherData = await WeatherService.getWeather(coordinates.lat, coordinates.lon);

    // save city to search history
    const newCity = {
      id: uuidv4(),
      name: city,
    };
    await HistoryService.addCity(newCity);

    res.json(weatherData);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
    return;
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getHistory();
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await HistoryService.removeCity(id);
    res.json({ message: 'City deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete city' });
  }
});

export default router;
