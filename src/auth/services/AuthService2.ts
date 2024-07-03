import { injectable } from 'inversify';

@injectable()
class AuthService {
    async registerWithHS256({ name, email, password }: { name: string; email: string; password: string }) {
        return { code: 201, message: 'User registered successfully', status: 'success' };
    }

    async loginWithHS256({ email, password }: { email: string; password: string }) {
        return { code: 200, message: 'Login successful', status: 'success', data: { accessToken: "123", refreshToken: "456" } };
    }
}

export default AuthService;
