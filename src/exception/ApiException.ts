export class ApiException extends Error {
    public code: string;
    public shortDesc: string;
    public status: number;

    constructor(message: string, code: string, shortDesc: string, status: number) {
        super(message);
        this.code = code;
        this.shortDesc = shortDesc;
        this.status = status;
    }
}
