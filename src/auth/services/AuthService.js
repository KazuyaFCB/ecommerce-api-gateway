const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const KeyModel = require('../models/KeyModel');
const UserModel = require('../models/UserModel');
const UserRepository = require('../repositories/UserRepository');
const KeyRepository = require('../repositories/KeyRepository');

const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  SHOP: 'SHOP'
}

class AuthService {
  static async register({ name, email, password }) {
    try {
      // Kiểm tra xem user đã tồn tại chưa
      const existingUser = await UserRepository.findOneByEmail(email);
      if (existingUser) {
        return { code: 400, message: 'User already exists', status: 'error' };
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo user mới
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword
      });
      await UserRepository.save(newUser);

      // Tạo cặp khóa RSA
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
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

      const publicKeyString = publicKey.toString();
      const privateKeyString = privateKey.toString();

      // Lưu cặp khóa vào collection Keys
      const newKey = new KeyModel({
        userId: newUser._id,
        publicKey: publicKeyString,
        privateKey: privateKeyString
      });
      await KeyRepository.save(newKey);

      // Lưu publicKey vào Redis
      await KeyRepository.setPublicKey(newUser._id.toString(), publicKeyString);

      return { code: 201, message: 'User registered successfully', status: 'success' };
    } catch (error) {
      console.error(error);
      return { code: 500, message: 'Internal Server Error', status: 'error' };
    }
  };

  static async login({ email, password }) {
    try {
      const user = await UserRepository.findOneByEmail(email);
      if (!user) {
        return { code: 404, message: 'User not found', status: 'error' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { code: 401, message: 'Invalid credentials', status: 'error' };
      }

      const dbKey = await KeyRepository.findByUserId(user._id);
      if (!dbKey) {
        return { code: 404, message: 'Key not found', status: 'error' };
      }
      let publicKey = dbKey.publicKey;
      let privateKey = dbKey.privateKey;

      const payload = { userId: user._id, email: user.email };
      const accessToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '15m' });
      const refreshToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '7d' });

      return { code: 200, message: 'Login successful', status: 'success', data: { accessToken, refreshToken } };
    } catch (error) {
      console.error(error);
      return { code: 500, message: 'Internal Server Error', status: 'error' };
    }
  }

  static async verifyToken(token) {
    try {
      const payload = jwt.decode(token);
      const userId = payload.userId;

      let publicKey = await KeyRepository.getPublicKey(userId);
      if (!publicKey) {
        const dbKey = await KeyRepository.findByUserId(userId);
        if (!dbKey) {
          return { code: 404, message: 'Key not found', status: 'error' };
        }
        publicKey = dbKey.publicKey;
        await KeyRepository.setPublicKey(userId, publicKey);
      }

      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      return { code: 200, message: 'Token is valid', status: 'success', data: decoded };
    } catch (error) {
      return { code: 401, message: 'Invalid token', status: 'error' };
    }
  };
};

module.exports = AuthService;