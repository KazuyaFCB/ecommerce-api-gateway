const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const UserModel = require('../models/UserModel');
const UserRepository = require('../repositories/UserRepository');
const Role = require('../utils/Role');
const JwtService = require('../../jwt/services/JwtService');

class AuthService {
  // ========== For HS256 ==========
  static async registerWithHS256({ name, email, password }) {
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
        password: hashedPassword,
        roles: [Role.USER]
      });
      await UserRepository.save(newUser);

      await JwtService.createHS256Key(newUser._id);
      
      return { code: 201, message: 'User registered successfully', status: 'success' };
    } catch (error) {
      console.error(error);
      return { code: 500, message: 'Internal Server Error', status: 'error' };
    }
  };

  static async loginWithHS256({ email, password }) {
    try {
      const user = await UserRepository.findOneByEmail(email);
      if (!user) {
        return { code: 404, message: 'User not found', status: 'error' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { code: 401, message: 'Invalid credentials', status: 'error' };
      }

      const { accessToken, refreshToken } = await JwtService.createTokenWithHS256(user);

      return { code: 200, message: 'Login successful', status: 'success', data: { accessToken, refreshToken } };
    } catch (error) {
      console.error(error);
      return { code: 500, message: 'Internal Server Error', status: 'error' };
    }
  }

  // ========== For RS256 ==========

  static async registerWithRS256({ name, email, password }) {
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
        password: hashedPassword,
        roles: [Role.USER]
      });
      await UserRepository.save(newUser);

      await JwtService.createRS256Key(newUser._id);
      
      return { code: 201, message: 'User registered successfully', status: 'success' };
    } catch (error) {
      console.error(error);
      return { code: 500, message: 'Internal Server Error', status: 'error' };
    }
  };

  static async loginWithRS256({ email, password }) {
    try {
      const user = await UserRepository.findOneByEmail(email);
      if (!user) {
        return { code: 404, message: 'User not found', status: 'error' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { code: 401, message: 'Invalid credentials', status: 'error' };
      }

      const { accessToken, refreshToken } = await JwtService.createTokenWithRS256(user);

      return { code: 200, message: 'Login successful', status: 'success', data: { accessToken, refreshToken } };
    } catch (error) {
      console.error(error);
      return { code: 500, message: 'Internal Server Error', status: 'error' };
    }
  }
};

module.exports = AuthService;