import { IUser } from "../model/UserModel";

export class UserDTO {
    _id: string;
    email: string;
    status: string;
    roles: string[];

    constructor(_id: string, email: string, status: string, roles: string[]) {
        this._id = _id;
        this.email = email;
        this.status = status;
        this.roles = roles;
    }

    static convertToDTO(user: IUser) {
        return new UserDTO(user._id, user.email, user.status, user.roles);
    }
}