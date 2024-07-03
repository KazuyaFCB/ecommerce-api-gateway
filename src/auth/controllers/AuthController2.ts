import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import AuthService from '../services/AuthService2';

@injectable()
class AuthController {
    constructor(@inject(AuthService) private authService: AuthService) { }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            const result = await this.authService.registerWithHS256({ name, email, password });

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
            const result = await this.authService.loginWithHS256({ email, password });

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
