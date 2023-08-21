import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from 'express';
interface ExceptionResponse{
    message: string, 
    code: string 
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as ExceptionResponse;
        
        response.status(status).json({
            success: false,
            content: exceptionResponse.message || exceptionResponse,
            code: exceptionResponse.code
        })
        
    }
    
}