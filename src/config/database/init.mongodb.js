const mongoose = require('mongoose');
const checkConnect = require('../../helpers/check.connect');
const database = require("config").get(`${process.env.NODE_ENV}.database`);

const connectionString = `mongodb+srv://${database.user}:${database.password}@${database.host}/?retryWrites=true&w=majority&appName=${database.name}`;


class MongoDB {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (1 === 1) { // check dev env
            // Print execution when querying database
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true});
        }
        mongoose.connect(connectionString)
            .then(() => {
                console.log("Connected to MongoDB");
                checkConnect.countConnection();
            })
            .catch((err) => console.log(err));
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new MongoDB();
        }
        return this.instance;
    }

}

const instanceMongoDB = MongoDB.getInstance();
module.exports = {
    instanceMongoDB
}