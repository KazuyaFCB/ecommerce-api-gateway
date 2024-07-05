import { Request, Response, NextFunction } from 'express';
import JwtUtility from '../../jwt/JwtUtility';

type Role = string;

function verifyAuthToken(requiredRoles: Role[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!requiredRoles || requiredRoles.length === 0) return next();

        let token = req.headers['authorization'];

        if (!token) {
            return res.status(401).send({ message: 'No token provided.' });
        }
        token = token.split(" ")[1]; // remove "Bearer"

        try {
            const decodedPayload = JwtUtility.extractToken(token);
            if (decodedPayload === null) {
                return res.status(401).send({ message: 'Invalid token format.' });
            }

            JwtUtility.verifyAuthToken(token);

            // Check if any role in the token matches the required roles
            const hasRequiredRole = (decodedPayload.role as Role[]).some(role => requiredRoles.includes(role));
            if (!hasRequiredRole) {
                return res.status(403).send({ message: 'Access denied.' });
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(401).send({ message: 'Invalid token.' });
        }
    };
}

export default verifyAuthToken;
