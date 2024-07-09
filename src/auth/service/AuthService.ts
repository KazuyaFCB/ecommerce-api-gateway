import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';

import UserRepository from '../repository/UserRepository';
import UserModel from '../model/UserModel';
import Role from '../../constant/Role';
import JwtUtility from '../../util/JwtUtility';
import AccessTokenService from './AccessTokenService';
import RefreshTokenService from './RefreshTokenService';
import { ApiException } from '../../exception/ApiException';
import { ErrorCode } from '../../exception/ErrorCode';
import { HttpStatus } from '../../constant/HttpStatus';

@injectable()
class AuthService {
    @inject(UserRepository) private userRepository!: UserRepository;

    @inject(AccessTokenService) private accessTokenService!: AccessTokenService;

    @inject(RefreshTokenService) private refreshTokenService!: RefreshTokenService;

    async register({ email, password }: { email: string; password: string }) {
        // Kiểm tra xem user đã tồn tại chưa
        const existingUser = await this.userRepository.findOneByEmail(email);
        if (existingUser) {
            throw new ApiException(
                ErrorCode.USER_ALREADY_EXISTS_ERR_MSG,
                ErrorCode.USER_ALREADY_EXISTS_ERR_CODE,
                `Email: ${email}`,
                HttpStatus.CONFLICT
            );
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new UserModel({
            email,
            password: hashedPassword,
            roles: [Role.USER]
        });
        await this.userRepository.save(newUser);

        return { code: 201, message: 'User registered successfully', status: 'success' };
    }

    async login({ email, password }: { email: string; password: string }) {
        const user = await this.userRepository.findOneByEmail(email);
        if (!user) {
            throw new ApiException(
                ErrorCode.USER_NOT_FOUND_ERR_MSG,
                ErrorCode.USER_NOT_FOUND_ERR_CODE,
                `Email: ${email}`,
                HttpStatus.NOT_FOUND
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiException(
                ErrorCode.INVALID_CREDENTIALS_ERR_MSG,
                ErrorCode.INVALID_CREDENTIALS_ERR_CODE,
                `Email: ${email}`,
                HttpStatus.UNAUTHORIZED
            );
        }

        const { accessToken, refreshToken } = await JwtUtility.createAuthToken(user);

        await this.accessTokenService.saveAccessToken(user._id.toString(), accessToken);

        await this.refreshTokenService.saveRefreshToken(user._id.toString(), refreshToken);

        return { code: 200, message: 'Login successful', status: 'success', data: { accessToken, refreshToken } };
    }
}

export default AuthService;
