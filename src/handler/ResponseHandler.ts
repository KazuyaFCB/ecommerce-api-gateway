import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';


export default {
    sendSuccessResponse: function (res: Response, body: any): Response {
        return res.status(StatusCodes.OK).json({
            message: getReasonPhrase(StatusCodes.OK),
            metadata: body
        });
    },

    sendCreatedResponse: function (res: Response, body: any): Response {
        return res.status(StatusCodes.CREATED).json({
            message: getReasonPhrase(StatusCodes.CREATED),
            metadata: body
        });
    },

    sendResponse: function (res: Response, status: number, body: any): Response {
        return res.status(status).json({
            message: getReasonPhrase(status),
            metadata: body
        });
    }
}
