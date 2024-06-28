import User from '@/models/User';
import { removeUploadedFile, uploadSingleFile } from '@/utils/files';
import { Request, Response } from 'express';
import { getStorage, ref, deleteObject } from 'firebase/storage';

export const getUserProfile = async (req: Request, res: Response) => {
  const profileData = await User.findById(req.userId).lean();
  console.log(profileData);
  return profileData;
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const file = req.file as any;

  if (file) {
    const user = await User.findById(req.userId);
    if (user && user.avatar) {
      await removeUploadedFile(user.avatar);
    }
    const avatarUrl = await uploadSingleFile(file, 'avatars');
    req.body.avatar = avatarUrl;
  }

  const profileData = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).lean();
  return profileData;
};
