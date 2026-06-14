import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../utils/jwt';
import { ForbiddenError } from '../utils/errors';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
}

export function requireSelfOrRole(paramKey: string, ...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }

    const targetId = Number(req.params[paramKey]);
    const isSelf = req.user.role === 'student' && req.user.userId === targetId;
    const hasRole = roles.includes(req.user.role);

    if (!isSelf && !hasRole) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
}
