const KeyModel = require('../models/KeyModel');
const redis = require('../../config/cache/Redis');

class KeyRepository {
  static async save(key) {
    return key.save();
  }

  static async getPublicKey(userId) {
    return await redis.get('publicKeys', userId);
  }

  static async setPublicKey(userId, publicKey) {
    await redis.save('publicKeys', userId, publicKey);
  }

  static async findByUserId(userId) {
    return KeyModel.findOne({ userId }).lean();
  }
}

module.exports = KeyRepository;