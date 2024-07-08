import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import AuthService from '../service/AuthService';

@injectable()
class AuthController {
    @inject(AuthService) private authService!: AuthService;
    // constructor(@inject(AuthService) private authService: AuthService) { }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            const result = await this.authService.register({ name, email, password });

            if (result.status === 'success') {
                return res.status(201).json(result);
            } else {
                return res.status(result.code).json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login({ email, password });

            if (result.status === 'success') {
                return res.status(200).json(result);
            } else {
                return res.status(result.code).json(result);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
