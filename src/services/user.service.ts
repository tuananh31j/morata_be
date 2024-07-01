import User from '@/models/User';
import { removeUploadedFile, uploadSingleFile } from '@/utils/files';
import { Request, Response } from 'express';
import _ from 'lodash';

export const getUserProfile = async (req: Request, res: Response) => {
  const profileData = await User.findById(req.userId).lean();
  const result = _.pick(profileData, ['username', 'email', 'avatar']);
  return result;
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const file = req.file as any;

  if (file) {
    const user = await User.findById(req.userId);
    if (user && user.avatar) {
      await removeUploadedFile(user.avatar);
    }
    const { downloadURL, urlRef } = await uploadSingleFile(file, 'avatars');
    req.body.avatar = downloadURL;
    req.body.avatarRef = urlRef;
  }

  const profileData = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).lean();
  return profileData;
};
