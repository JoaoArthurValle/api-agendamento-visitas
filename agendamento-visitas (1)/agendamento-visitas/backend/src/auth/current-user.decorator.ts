import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserType {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
