import { IUser } from "../model/UserModel";
import { UserDTO } from "./UserDTO";

namespace RegisterDTO {
    export class RegisterRequest {
        email: string;
        password: string;

        constructor(email: string, password: string) {
            this.email = email;
            this.password = password;
        }
    }

    export class RegisterResponse {
        createdUser: UserDTO;

        constructor(createdUser: IUser) {
            this.createdUser = UserDTO.convertToDTO(createdUser);
        }
    }
}

export default RegisterDTO;
