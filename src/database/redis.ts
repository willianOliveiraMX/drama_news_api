import { createClient, RedisClientType } from 'redis';
import config from '../config/config';

class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType | null = null;
  private connected = false;

  private constructor() {}

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async connect(): Promise<void> {
    if (this.client && this.connected) {
      console.log('Redis already connected');
      return;
    }

    if (!config.redisUrl) {
      console.warn('Redis URL not configured. Cache middleware will be disabled.');
      return;
    }

    try {
      this.client = createClient({
        url: config.redisUrl
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.connected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis client connected');
        this.connected = true;
      });

      this.client.on('disconnect', () => {
        console.warn('Redis client disconnected');
        this.connected = false;
      });

      await this.client.connect();
    } catch (err) {
      console.error('Failed to initialize Redis:', err);
      this.client = null;
      this.connected = false;
    }
  }

  public getClient(): RedisClientType | null {
    return this.client;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async disconnect(): Promise<void> {
    if (this.client && this.connected) {
      await this.client.quit();
      this.connected = false;
    }
  }
}

export default RedisClient.getInstance();
