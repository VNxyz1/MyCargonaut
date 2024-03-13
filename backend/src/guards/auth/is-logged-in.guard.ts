import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ISession } from '../../utils/ISession';

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as ISession;
    return session.isLoggedIn;
  }
}
