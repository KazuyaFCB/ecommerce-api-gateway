const jwt = require('jsonwebtoken');

const JwtService = require('../../jwt/services/JwtService');
const KeyRepository = require('../../jwt/repositories/KeyRepository');

function verifyTokenWithHS256(requiredRoles) {
    return async (req, res, next) => {
        const token = req.headers['authorization'].split(" ")[1]; // remove "Bearer"
        
        if (!token) {
            return res.status(401).send({ message: 'No token provided.' });
        }

        try {
            const decodedPayload = JwtService.extractToken(token);
            if (decodedPayload === null) {
                return res.status(401).send({ message: 'Invalid token format.' });
            }
            const userId = decodedPayload.userId;

            const key = await KeyRepository.findByUserId(userId);
            jwt.verify(token, key.privateKey, { complete: true, algorithm: 'HS256' });

            // Check if any role in the token matches the required roles
            const hasRequiredRole = decodedPayload.role.some(role => requiredRoles.includes(role));
            if (!hasRequiredRole) {
                return res.status(403).send({ message: 'Access denied.' });
            }

            req.user = decodedPayload;
            console.log("verify token is ok");
            //return res.status(200).send({ message: 'OK.' });
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).send({ message: 'Invalid token.' });
        }
    };
}

function verifyTokenWithRS256(requiredRoles) {
    return async (req, res, next) => {
        const token = req.headers['authorization'].split(" ")[1]; // remove "Bearer"
        
        if (!token) {
            return res.status(401).send({ message: 'No token provided.' });
        }

        try {
            const decodedPayload = JwtService.extractToken(token);
            if (decodedPayload === null) {
                return res.status(401).send({ message: 'Invalid token format.' });
            }
            const userId = decodedPayload.userId;

            const key = await KeyRepository.findByUserId(userId, true);
            jwt.verify(token, key.publicKey, { complete: true, algorithm: 'RS256' });

            // Check if any role in the token matches the required roles
            const hasRequiredRole = decodedPayload.role.some(role => requiredRoles.includes(role));
            if (!hasRequiredRole) {
                return res.status(403).send({ message: 'Access denied.' });
            }

            req.user = decodedPayload;
            console.log("verify token is ok");
            //return res.status(200).send({ message: 'OK.' });
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).send({ message: 'Invalid token.' });
        }
    };
}

module.exports = { verifyTokenWithHS256, verifyTokenWithRS256 };
