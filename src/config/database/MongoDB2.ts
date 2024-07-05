import mongoose from 'mongoose';
import checkConnect from '../../helpers/check.connect2';
import config from 'config';
import { injectable, Container } from 'inversify';
import { provide } from 'inversify-binding-decorators';

const mongodbConfig = config.get<{ user: string; password: string; host: string; name: string }>(`${process.env.NODE_ENV}.database.mongodb`);

const connectionString = `mongodb+srv://${mongodbConfig.user}:${mongodbConfig.password}@${mongodbConfig.host}/?retryWrites=true&w=majority&appName=${mongodbConfig.name}`;

@provide(MongoDB, true)
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
