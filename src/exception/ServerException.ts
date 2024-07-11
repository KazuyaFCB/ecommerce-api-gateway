import { ApiException } from './ApiException';
import { ErrorCode } from './ErrorCode';
import { StatusCodes } from 'http-status-codes';

export class ServerException extends ApiException {
    constructor() {
        super(ErrorCode.GENERIC_ERR_MSG, ErrorCode.GENERIC_ERR_CODE, "", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
