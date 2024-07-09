import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import AuthService from '../service/AuthService';

@injectable()
class AuthController {
    @inject(AuthService) private authService!: AuthService;
    // constructor(@inject(AuthService) private authService: AuthService) { }

    async register(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        const result = await this.authService.register({ email, password });
        return res.status(201).json(result);
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        const result = await this.authService.login({ email, password });
        return res.status(200).json(result);
    }
}

export default AuthController;
