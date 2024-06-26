const UserModel = require('../models/UserModel');

class UserRepository {
  static async findOneByEmail(email) {
    return UserModel.findOne({ email }).lean();
  }

  static async findById(userId) {
    return UserModel.findById(userId).lean();
  }

  static async save(user) {
    return user.save();
  }
}

module.exports = UserRepository;