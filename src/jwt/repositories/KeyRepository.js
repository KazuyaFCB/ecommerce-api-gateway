const KeyModel = require('../models/KeyModel');
const redis = require('../../config/cache/Redis');

class KeyRepository {
  static async save(key, isRS256) {
    const savedKey = key.save();
    await redis.save('privateKeys', key.userId.toString(), key.privateKey);
    if (isRS256) {
      await redis.save('publicKeys', key.userId.toString(), key.publicKey);
    }
    return savedKey;
  }

  static async findByUserId(userId, isRS256) {
    let privateKey = await redis.get('privateKeys', userId.toString());
    let publicKey = null;
    if (isRS256) {
      publicKey = await redis.get('publicKeys', userId.toString());
    }
    if (!privateKey) {
      const key = await KeyModel.findOne({ userId }).lean();
      await redis.save('privateKeys', key.userId.toString(), key.privateKey);
      if (isRS256) {
        await redis.save('publicKeys', key.userId.toString(), key.publicKey);
      }
      return key;
    }
    return {
      userId, privateKey, publicKey
    }    
  }
}

module.exports = KeyRepository;