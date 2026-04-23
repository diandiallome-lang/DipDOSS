import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.role === 'ADMIN') {
      return true;
    }

    throw new ForbiddenException("Accès refusé : Droits d'administrateur requis.");
  }
}
