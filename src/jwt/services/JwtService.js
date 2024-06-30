const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const KeyModel = require('../models/KeyModel');
const KeyRepository = require('../repositories/KeyRepository');

class JwtService {
  static extractToken(token) {
    // Lấy phần payload từ token mà không cần xác thực
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        return null;
    }
    const decodedPayload = JSON.parse(this.base64UrlDecode(tokenParts[1]));
    return decodedPayload;
  }

  static base64UrlDecode(str) {
    return Buffer.from(str, 'base64').toString('utf8');
  }

  // ========== For HS256 ==========

  static async createHS256Key(userId) {
    const privateKeyString = crypto.randomBytes(64).toString('hex');
    const newKey = new KeyModel({
      userId: userId,
      privateKey: privateKeyString
    });
    await KeyRepository.save(newKey);
  }

  static async createTokenWithHS256(user) {
    const dbKey = await KeyRepository.findByUserId(user._id, true);
    if (!dbKey) {
      return { code: 404, message: 'Key not found', status: 'error' };
    }
    let privateKey = dbKey.privateKey;

    const payload = { userId: user._id, role: user.roles };
    const accessToken = jwt.sign(payload, privateKey, { algorithm: 'HS256', expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, privateKey, { algorithm: 'HS256', expiresIn: '7d' });

    return { accessToken, refreshToken }
  }

  // ========== For RS256 ==========

  static async createRS256Key(userId) {
    // Tạo cặp khóa RSA
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

    // Lưu cặp khóa vào collection Keys
    const newKey = new KeyModel({
      userId: userId,
      privateKey: privateKeyString,
      publicKey: publicKeyString
    });
    await KeyRepository.save(newKey, true);

  }

  static async createTokenWithRS256(user) {
    const dbKey = await KeyRepository.findByUserId(user._id, true);
    if (!dbKey) {
      return { code: 404, message: 'Key not found', status: 'error' };
    }
    let publicKey = dbKey.publicKey;
    let privateKey = dbKey.privateKey;

    const payload = { userId: user._id, role: user.roles };
    const accessToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '7d' });

    return { accessToken, refreshToken }
  }
};

module.exports = JwtService;