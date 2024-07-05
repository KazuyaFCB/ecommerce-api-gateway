import { injectable } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import UserModel, { IUser } from '../models/UserModel2';

@provide(UserRepository, true)
@injectable()
class UserRepository {
    async findOneByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email }).lean().exec();
    }

    async findById(userId: string): Promise<IUser | null> {
        return UserModel.findById(userId).lean().exec();
    }

    async save(user: IUser): Promise<IUser> {
        return user.save();
    }
}

export default UserRepository;
