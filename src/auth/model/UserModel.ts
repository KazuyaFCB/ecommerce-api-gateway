import { Schema, model, Document } from 'mongoose';

// Define the IUser interface extending Document with an optional _id property
export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    status: 'verified' | 'not verified' | 'blocked';
    roles: string[];
}

// Define the schema for the User model
const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['verified', 'not verified', 'blocked'],
        default: 'not verified',
    },
    roles: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
    collection: 'Users',
});

// Create and export the User model
const UserModel = model<IUser>('User', userSchema);
export default UserModel;
