const userModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

const Role = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    SHOP: 'SHOP'
}

class AuthService {
    static signUp = async ({ name, email, password }) => {

    }
}