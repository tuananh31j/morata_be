import User from '@/models/User';
import Location from '@/models/Location';
import { removeUploadedFile, uploadSingleFile } from '@/utils/files';
import { Request, Response } from 'express';
import _ from 'lodash';
import { LOCATION_TYPES } from '@/constant/location';

export const getUserProfile = async (req: Request, res: Response) => {
    const profileData = await User.findById(req.userId).lean();

    const address = await Location.findOne({ user: req.userId, type: LOCATION_TYPES.DEFAULT }).lean();

    const result = _.pick(profileData, ['username', 'email', 'avatar', 'phone', 'address', 'role']);
    return { ...result, address };
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

    const userAddress = await Location.findOneAndUpdate(
        { user: req.userId, type: LOCATION_TYPES.DEFAULT },
        req.body.address,
        { new: true },
    ).lean();

    const profileData = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).lean();
    return { profileData, userAddress };
};
