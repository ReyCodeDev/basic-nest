import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    res.locals.userAgent = req.headers['user-agent'];
    res.locals.lang = this.getLanguage(req);
    next();
  }
  private getLanguage(req: Request): string {
    return req.headers['accept-language']?.split(';')[0].split(',')[0] || 'en';
  }
}
