import { inject, injectable } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import bcrypt from 'bcrypt';

import UserRepository from '../repositories/UserRepository2';
import UserModel from '../models/UserModel2';
import Role from '../../utils/Role2';
import JwtUtility from '../../jwt/JwtUtility';

@provide(AuthService, true)
@injectable()
class AuthService {
    @inject(UserRepository) private userRepository!: UserRepository;

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

            return { code: 200, message: 'Login successful', status: 'success', data: { accessToken, refreshToken } };
        } catch (error) {
            console.error(error);
            return { code: 500, message: 'Internal Server Error', status: 'error' };
        }
    }
}

export default AuthService;
