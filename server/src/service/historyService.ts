import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../db/db.json');

class HistoryService {
  private async read() {
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading db.json:', error);
      return [];
    }
  }

  private async write(cities: any[]) {
    try {
      await fs.writeFile(dbPath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to db.json:', error);
    }
  }

  async getHistory() {
    return this.read();
  }

  async addCity(city: { id: string; name: string }) {
    const history = await this.read();
    const cityExists = history.some((item: { name: string }) => item.name === city.name);
    if (!cityExists) {
      history.push(city);
      await this.write(history);
    }
  }

  async removeCity(id: string) {
    const history = await this.read();
    const updatedHistory = history.filter((city: { id: string }) => city.id !== id);
    await this.write(updatedHistory);
  }
}

export default new HistoryService();
