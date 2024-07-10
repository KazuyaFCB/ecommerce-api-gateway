import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import AuthService from '../service/AuthService';
import RegisterDTO from '../dto/RegisterDTO';
import LoginDTO from '../dto/LoginDTO';
import ResponseHandler from '../../util/ResponseHandler';

@injectable()
class AuthController {
    @inject(AuthService) private authService!: AuthService;
    // constructor(@inject(AuthService) private authService: AuthService) { }

    async register(req: Request, res: Response, next: NextFunction) {
        const registerRequest: RegisterDTO.RegisterRequest = req.body;
        const result = await this.authService.register(registerRequest);
        return ResponseHandler.sendResponse(res, 201, result);
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const loginRequest: LoginDTO.LoginRequest = req.body;
        const result = await this.authService.login(loginRequest);
        return ResponseHandler.sendResponse(res, 200, result);
    }
}

export default AuthController;
