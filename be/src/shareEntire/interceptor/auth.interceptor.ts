
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyRefreshJWT } from '../utils';
import { httpErrors } from '../exception-filter/http-errors.const';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>  {
    const request = context.switchToHttp().getRequest();
    const tokenHeader = request.headers.authorization;

    if (tokenHeader) {
      const token = tokenHeader.split(' ')[1];
      try {
        const payload = await  verifyRefreshJWT(token);

        if (typeof payload === 'object' && 'id' in payload) {
          request.user = { id: payload.id };

        }
      } catch {
        throw new HttpException(httpErrors.REQUEST_WITH_TOKEN_INVALID_OR_EXPIRED, HttpStatus.UNAUTHORIZED);

      }
    }
    return next.handle();
  }


}
