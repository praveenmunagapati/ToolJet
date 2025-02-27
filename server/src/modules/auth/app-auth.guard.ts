import { ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppsService } from 'src/services/apps.service';

@Injectable()
export class AppAuthGuard extends AuthGuard('jwt') {
  constructor(private appsService: AppsService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    // unauthenticated users should be able to to view public apps
    if (request.route.path.includes('/api/apps/slugs/:slug')) {
      const app = await this.appsService.findBySlug(request.params.slug);
      if (!app) throw new NotFoundException('App not found. Invalid app id');
      if (app.isPublic === true) {
        return true;
      }
    }

    return super.canActivate(context);
  }
}
