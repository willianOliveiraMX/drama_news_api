import { JSONFilePreset } from 'lowdb/node';

const JsonDb = async () => {
  const defaultData = { data: [] };
  const db = await JSONFilePreset('./data.json', defaultData);
  return db;
}

export default JsonDb;
