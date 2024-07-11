import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import UserRepository from '../repository/UserRepository';
import UserModel from '../model/UserModel';
import Role from '../../constant/Role';
import JwtUtility from '../../util/JwtUtility';
import AccessTokenService from './AccessTokenService';
import RefreshTokenService from './RefreshTokenService';
import { ApiException } from '../../exception/ApiException';
import { ErrorCode } from '../../exception/ErrorCode';
import RegisterDTO from '../dto/RegisterDTO';
import LoginDTO from '../dto/LoginDTO';

@injectable()
class AuthService {
    @inject(UserRepository) private userRepository!: UserRepository;

    @inject(AccessTokenService) private accessTokenService!: AccessTokenService;

    @inject(RefreshTokenService) private refreshTokenService!: RefreshTokenService;

    async register(registerRequest : RegisterDTO.RegisterRequest) {
        // Kiểm tra xem user đã tồn tại chưa
        const existingUser = await this.userRepository.findOneByEmail(registerRequest.email);
        if (existingUser) {
            throw new ApiException(
                ErrorCode.USER_ALREADY_EXISTS_ERR_MSG,
                ErrorCode.USER_ALREADY_EXISTS_ERR_CODE,
                `Email: ${registerRequest.email}`,
                StatusCodes.CONFLICT
            );
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(registerRequest.password, 10);

        // Tạo user mới
        const newUser = new UserModel({
            email: registerRequest.email,
            password: hashedPassword,
            roles: [Role.USER]
        });
        await this.userRepository.save(newUser);

        return new RegisterDTO.RegisterResponse(newUser);
    }

    async login(loginRequest: LoginDTO.LoginRequest) {
        const user = await this.userRepository.findOneByEmail(loginRequest.email);
        if (!user) {
            throw new ApiException(
                ErrorCode.USER_NOT_FOUND_ERR_MSG,
                ErrorCode.USER_NOT_FOUND_ERR_CODE,
                `Email: ${loginRequest.email}`,
                StatusCodes.NOT_FOUND
            );
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
        if (!isPasswordValid) {
            throw new ApiException(
                ErrorCode.INVALID_CREDENTIALS_ERR_MSG,
                ErrorCode.INVALID_CREDENTIALS_ERR_CODE,
                `Email: ${loginRequest.email}`,
                StatusCodes.UNAUTHORIZED
            );
        }

        const { accessToken, refreshToken } = await JwtUtility.createAuthToken(user);

        await this.accessTokenService.saveAccessToken(user._id.toString(), accessToken);

        await this.refreshTokenService.saveRefreshToken(user._id.toString(), refreshToken);

        return new LoginDTO.LoginResponse(accessToken, refreshToken, user);
    }
}

export default AuthService;
