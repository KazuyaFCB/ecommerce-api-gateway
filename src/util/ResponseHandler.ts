import { Request, Response, NextFunction } from 'express';

export default {
    sendResponse: function (res: Response, status: number, body: any): Response {
        return res.status(status).json(body);
    }
}
