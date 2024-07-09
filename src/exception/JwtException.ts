import { ApiException } from './ApiException';
import { ErrorCode } from './ErrorCode';
import { HttpStatus } from '../constant/HttpStatus';

export class JwtException extends ApiException {
    // Các khai báo hàm overload
    constructor();
    constructor(message: string);
    constructor(message: string, status: number);

    // Constructor thực tế sẽ xử lý tất cả các trường hợp
    constructor(message: string = "", status: number = HttpStatus.UNAUTHORIZED) {
        super(message, ErrorCode.JWT_ERR_CODE, "", status);
    }
}
