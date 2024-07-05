import { createClient, RedisClientType } from 'redis';
import { injectable } from 'inversify';
import { provide } from 'inversify-binding-decorators';

@provide(RedisClient, true)
@injectable()
class RedisClient {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: 'redis://localhost:6379',
            legacyMode: true
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
        return new Promise((resolve, reject) => {
            this.client.hSet(key, field, value).then(
                () => resolve(),
                (error: Error) => {
                    console.error(`RedisClient :: save :: Cannot set key: ${key} to Redis :: Error :: ${error}`);
                    reject(error);
                }
            );
        });
    }

    async get(key: string, field: string): Promise<string | null> {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.client.hGet(key, field).then(
                (result: string | null | undefined) => resolve(result ?? null),
                (error: Error) => {
                    console.error(`RedisClient :: get :: Cannot get key: ${key} from Redis :: Error :: ${error}`);
                    reject(error);
                }
            );
        });
    }

}

export default RedisClient;
