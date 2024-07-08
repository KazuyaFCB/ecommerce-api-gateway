import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';

import UserRepository from '../repository/UserRepository';
import UserModel from '../model/UserModel';
import Role from '../../util/Role';
import JwtUtility from '../../util/JwtUtility';
import AccessTokenService from './AccessTokenService';
import RefreshTokenService from './RefreshTokenService';

@injectable()
class AuthService {
    @inject(UserRepository) private userRepository!: UserRepository;

    @inject(AccessTokenService) private accessTokenService!: AccessTokenService;

    @inject(RefreshTokenService) private refreshTokenService!: RefreshTokenService;

    async register({ name, email, password }: { name: string; email: string; password: string }) {
        try {
            // Kiểm tra xem user đã tồn tại chưa
            const existingUser = await this.userRepository.findOneByEmail(email);
            if (existingUser) {
                return { code: 400, message: 'User already exists', status: 'error' };
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo user mới
            const newUser = new UserModel({
                name,
                email,
                password: hashedPassword,
                roles: [Role.USER]
            });
            await this.userRepository.save(newUser);

            return { code: 201, message: 'User registered successfully', status: 'success' };
        } catch (error) {
            console.error(error);
            return { code: 500, message: 'Internal Server Error', status: 'error' };
        }
    }

    async login({ email, password }: { email: string; password: string }) {
        try {
            const user = await this.userRepository.findOneByEmail(email);
            if (!user) {
                return { code: 404, message: 'User not found', status: 'error' };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { code: 401, message: 'Invalid credentials', status: 'error' };
            }

            const { accessToken, refreshToken } = await JwtUtility.createAuthToken(user);

            await this.accessTokenService.saveAccessToken(user._id.toString(), accessToken);

            await this.refreshTokenService.saveRefreshToken(user._id.toString(), refreshToken);

            return { code: 200, message: 'Login successful', status: 'success', data: { accessToken, refreshToken } };
        } catch (error) {
            console.error(error);
            return { code: 500, message: 'Internal Server Error', status: 'error' };
        }
    }
}

export default AuthService;
