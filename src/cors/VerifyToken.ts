import { Request, Response, NextFunction } from 'express';

import container from '../config/ioc/InversifyConfig';
import JwtUtility from '../util/JwtUtility';
import AccessTokenService from '../auth/service/AccessTokenService';
import { JwtException } from '../exception/JwtException';
import { ErrorCode } from '../exception/ErrorCode';
import { HttpStatus } from '../constant/HttpStatus';

type Role = string;

const accessTokenService = container.resolve(AccessTokenService);

function verifyAuthToken(requiredRoles: Role[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!requiredRoles || requiredRoles.length === 0) return next();

        let token = req.headers['authorization'];

        if (!token) {
            throw new JwtException(ErrorCode.JWT_NO_TOKEN_PROVIDED_ERR_MSG);
        }
        token = token.split(" ")[1]; // remove "Bearer"

        try {
            const decodedPayload = JwtUtility.extractToken(token);
            if (decodedPayload === null) {
                throw new JwtException(ErrorCode.JWT_INVALID_TOKEN_FORMAT_ERR_MSG);
            }

            const accessToken = await accessTokenService.getAccessToken(decodedPayload.userId.toString());
            if (token !== accessToken) {
                throw new JwtException(ErrorCode.JWT_ACCESS_TOKEN_NOT_EXISTS_ERR_MSG);
            }

            JwtUtility.verifyAuthToken(token);

            // Check if any role in the token matches the required roles
            const hasRequiredRole = (decodedPayload.role as Role[]).some(role => requiredRoles.includes(role));
            if (!hasRequiredRole) {
                throw new JwtException(ErrorCode.JWT_ACCESS_DENIED_ERR_MSG, HttpStatus.FORBIDDEN);
            }

            next();
        } catch (error) {
            if (error instanceof JwtException) throw error;
            console.log(error);
            throw new JwtException(ErrorCode.JWT_INVALID_TOKEN_ERR_MSG);
        }
    };
}

export default verifyAuthToken;
