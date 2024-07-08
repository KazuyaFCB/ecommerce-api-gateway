import { inject, injectable } from 'inversify';

import Redis from '../../config/cache/Redis';

@injectable()
class RefreshTokenService {
    REFRESH_TOKEN_KEY : string = "REFRESH_TOKEN";

    @inject(Redis) private redis!: Redis;

    async saveRefreshToken(userId: string, refreshToken: string) {
        await this.redis.save(this.REFRESH_TOKEN_KEY, userId, refreshToken);
    }

    async getRefreshToken(userId: string) {
        return await this.redis.get(this.REFRESH_TOKEN_KEY, userId);
    }
}

export default RefreshTokenService;
