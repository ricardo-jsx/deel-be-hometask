import { Request, Response, NextFunction } from 'express';
import { Profile } from '~/core/models/profile';

declare module 'express-serve-static-core' {
  interface Request {
    profile?: Profile;
  }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const profile = await Profile.findOne({ where: { id: req.get('profile_id') || 0 } });
  
  if (!profile) {
    res.status(401).end();
    return;
  }

  req.profile = profile;
  next();
};