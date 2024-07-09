import { Request, Response, NextFunction } from 'express';
import { ApiException } from './ApiException';
import { JwtException } from './JwtException';
import { ServerException } from './ServerException';
import { HttpStatus } from '../constant/HttpStatus';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ApiException || err instanceof JwtException) {
        return res.status(err.status).json({
            code: err.code,
            message: err.message,
            shortDesc: err.shortDesc,
            status: err.status
        });
    }

    const serverError = new ServerException();
    return res.status(serverError.status).json({
        code: serverError.code,
        message: serverError.message,
        shortDesc: serverError.shortDesc,
        status: HttpStatus.INTERNAL_SERVER_ERROR
    });
}
