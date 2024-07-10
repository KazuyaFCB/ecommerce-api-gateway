import UserModel from "../model/UserModel";

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
        message: string;
        metadata: any;

        constructor(message: string, metadata: any) {
            this.message = message;
            this.metadata = metadata;
        }
    }
}

export default LoginDTO;
