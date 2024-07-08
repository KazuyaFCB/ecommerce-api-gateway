import mongoose from 'mongoose';
import checkConnect from '../../helper/CheckConnect';
import config from 'config';
import { injectable } from 'inversify';

const mongodbConfig = config.get<{ user: string; password: string; host: string; name: string }>(`${process.env.NODE_ENV}.database.mongodb`);

const connectionString = `mongodb+srv://${mongodbConfig.user}:${mongodbConfig.password}@${mongodbConfig.host}/?retryWrites=true&w=majority&appName=${mongodbConfig.name}`;

@injectable()
class MongoDB {
    constructor() {
        this.connect();
    }

    private connect(type = 'mongodb') {
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(connectionString)
            .then(() => {
                console.log("Connected to MongoDB");
                checkConnect.countConnection();
            })
            .catch((err: Error) => console.log(err));
    }
}

export default MongoDB;
