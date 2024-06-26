const AuthService = require('../services/AuthService');

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const result = await AuthService.register({ name, email, password });

            if (result.status === 'success') {
                return res.status(201).json(result);
            } else {
                return res.status(result.code).json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login({ email, password });

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

module.exports = new AuthController();