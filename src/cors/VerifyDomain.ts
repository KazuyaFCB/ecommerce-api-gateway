import { Request, Response, NextFunction } from 'express';

// Define the verifyDomain middleware
const verifyDomain = (req: Request, res: Response, next: NextFunction) => {
    // Get the allowed domains and secure token from environment variables
    const allowedDomains = (process.env.ALLOWED_DOMAINS || '').split(',');

    // Check if the request is from Postman
    const isFromPostman = req.headers['user-agent']?.includes('PostmanRuntime');

    // Check if the request origin is in the allowed domains
    const isFromAllowedDomain = allowedDomains.includes(req.headers.origin || '');

    // If the request is from Postman or an allowed domain, proceed
    if (isFromPostman || isFromAllowedDomain) {
        return next();
    }

    // Otherwise, return a 403 Forbidden response
    return res.status(403).send('Forbidden');
};

export default verifyDomain;
