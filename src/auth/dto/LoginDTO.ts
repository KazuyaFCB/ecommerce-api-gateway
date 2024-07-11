import { IUser } from "../model/UserModel";
import { UserDTO } from "./UserDTO";

namespace LoginDTO {
    export class LoginRequest {
        email: string;
        password: string;

        constructor(email: string, password: string) {
            this.email = email;
            this.password = password;
        }
    }

    export class LoginResponse {
        accessToken: string;
        refreshToken: string;
        userDetail: UserDTO;

        constructor(accessToken: string, refreshToken: string, userDetail: IUser) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.userDetail = UserDTO.convertToDTO(userDetail);
        }
    }
}

export default LoginDTO;
