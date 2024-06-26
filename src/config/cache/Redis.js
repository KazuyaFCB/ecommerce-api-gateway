const redis = require('redis');


class RedisClient {
    constructor() {
        if (!RedisClient.instance) {
            this.client = redis.createClient({
                host: 'localhost',
                port: 6379,
                legacyMode: true
            });

            this.client.on('connect', () => {
                console.log('Connected to Redis');
            });

            this.client.on('error', (err) => {
                console.error('Redis error:', err);
            });

            RedisClient.instance = this;
        }

        return RedisClient.instance;
    }

    async connect() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    async save(key, field, value) {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.client.hSet(key, field, value, (error) => {
                if (error) {
                    console.error(`RedisClient :: save :: Cannot set key: ${key} to Redis :: Error :: ${error}`);
                    reject(error);
                }
                resolve();
            });
        });
    }

    async get(key, field) {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.client.hGet(key, field, (error, result) => {
                if (error) {
                    console.error(`RedisClient :: get :: Cannot get key: ${key} from Redis :: Error :: ${error}`);
                    reject(error);
                }
                resolve(result);
            });
        });
    }
}

const redisClient = new RedisClient();
Object.freeze(redisClient);

module.exports = redisClient;
