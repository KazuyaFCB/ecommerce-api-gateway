import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { IUser } from "../auth/models/UserModel2";

interface TokenPayload {
    userId: string;
    role: string[];
}

class JwtUtility {
    static base64UrlDecode(str: string): string {
        return Buffer.from(str, 'base64').toString('utf8');
    }

    static extractToken(token: string): TokenPayload | null {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            return null;
        }
        const decodedPayload = JSON.parse(this.base64UrlDecode(tokenParts[1])) as TokenPayload;
        return decodedPayload;
    }

    // For Auth
    static getAuthSignatureAlgorithm(): "RS256" | "HS256" {
        return (process.env.AUTH_SIGNATURE_ALGORITHM as string) === "RS256" ? "RS256" : "HS256";
    }

    static async createAuthToken(user: IUser): Promise<{ accessToken: string; refreshToken: string }> {
        const privateKey = process.env.AUTH_KEY_TO_CREATE_TOKEN as string;
        const authSignatureAlgorithm = this.getAuthSignatureAlgorithm();
        const authAccessTokenTTL = process.env.AUTH_ACCESS_TOKEN_TTL as string;
        const authRefreshTokenTTL = process.env.AUTH_REFRESH_TOKEN_TTL as string;

        const payload: TokenPayload = { userId: user._id.toString(), role: user.roles };
        const accessToken = jwt.sign(payload, privateKey, { algorithm: authSignatureAlgorithm, expiresIn: authAccessTokenTTL });
        const refreshToken = jwt.sign(payload, privateKey, { algorithm: authSignatureAlgorithm, expiresIn: authRefreshTokenTTL });

        return { accessToken, refreshToken };
    }

    static verifyAuthToken(token: string): void {
        const privateKey = process.env.AUTH_KEY_TO_VERIFY_TOKEN as string;
        const authSignatureAlgorithm = this.getAuthSignatureAlgorithm();

        jwt.verify(token, privateKey, { complete: true, algorithms: [authSignatureAlgorithm] });
    }

    // Run manually to create key and set to env or vault
    static async createHS256Key(): Promise<string> {
        const privateKeyString = crypto.randomBytes(64).toString('hex');
        return privateKeyString;
    }

    static async createRS256Key(): Promise<{ publicKeyString: string; privateKeyString: string }> {
        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        });

        const publicKeyString = keyPair.publicKey.toString();
        const privateKeyString = keyPair.privateKey.toString();

        return { publicKeyString, privateKeyString };
    }
}

export default JwtUtility;
