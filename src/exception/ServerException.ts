import { ApiException } from './ApiException';
import { ErrorCode } from './ErrorCode';
import { HttpStatus } from '../constant/HttpStatus';

export class ServerException extends ApiException {
    constructor() {
        super(ErrorCode.GENERIC_ERR_MSG, ErrorCode.GENERIC_ERR_CODE, "", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
