import { createClient, RedisClientType } from 'redis';
import { injectable } from 'inversify';

@injectable()
class Redis {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: 'redis://localhost:6379',
            legacyMode: false // Modern Mode, this ensures that all commands return Promises and can be used with async/await without any issues, instead of older callback-based 
        }) as RedisClientType;

        this.client.on('connect', () => {
            console.log('Connected to Redis');
        });

        this.client.on('error', (err) => {
            console.error('Redis error:', err);
        });

        this.connect();
    }

    private async connect(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    async save(key: string, field: string, value: string): Promise<void> {
        await this.connect();
        try {
            await this.client.hSet(key, field, value);
            console.log(`Saved key: ${key}, field: ${field}, value: ${value}`);
        } catch (error) {
            console.error(`RedisClient :: save :: Cannot set key: ${key} to Redis :: Error :: ${error}`);
            throw error;
        }
    }

    async get(key: string, field: string): Promise<string | null> {
        await this.connect();
        try {
            const result = await this.client.hGet(key, field);
            console.log(`Retrieved key: ${key}, field: ${field}, value: ${result}`);
            return result ?? null;
        } catch (error) {
            console.error(`RedisClient :: get :: Cannot get key: ${key} from Redis :: Error :: ${error}`);
            throw error;
        }
    }

}

export default Redis;
