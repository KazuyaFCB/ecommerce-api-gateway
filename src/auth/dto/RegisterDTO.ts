import UserModel from "../model/UserModel";

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
        message: string;
        metadata: any;

        constructor(message: string, metadata: any) {
            this.message = message;
            this.metadata = metadata;
        }
    }
}

export default RegisterDTO;
