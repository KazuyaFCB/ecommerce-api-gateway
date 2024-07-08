import { inject, injectable } from 'inversify';

import Redis from '../../config/cache/Redis';

@injectable()
class AccessTokenService {
    ACCESS_TOKEN_KEY : string = "ACCESS_TOKEN";

    @inject(Redis) private redis!: Redis;

    async saveAccessToken(userId: string, accessToken: string) {
        await this.redis.save(this.ACCESS_TOKEN_KEY, userId, accessToken);
    }

    async getAccessToken(userId: string) {
        return await this.redis.get(this.ACCESS_TOKEN_KEY, userId);
    }
}

export default AccessTokenService;
