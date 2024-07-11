import { ApiException } from './ApiException';
import { ErrorCode } from './ErrorCode';
import { StatusCodes } from 'http-status-codes';

export class JwtException extends ApiException {
    // Các khai báo hàm overload
    constructor();
    constructor(message: string);
    constructor(message: string, status: number);

    // Constructor thực tế sẽ xử lý tất cả các trường hợp
    constructor(message: string = "", status: number = StatusCodes.UNAUTHORIZED) {
        super(message, ErrorCode.JWT_ERR_CODE, "", status);
    }
}
