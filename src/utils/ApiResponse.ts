class ApiResponse<T> {
    public readonly statusCode: number;
    public readonly data: T;
    public readonly message: string;
    public readonly success: boolean;

    constructor(statusCode: number, data: T, message: string = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
