
export class ApiError extends Error {
    constructor(
        statusCode,
        error
    ){
        this.statusCode = statusCode;
        this.error = error 
    }
}