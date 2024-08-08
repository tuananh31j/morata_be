import User from '@/models/User';
import Location from '@/models/Location';
import { removeUploadedFile, uploadSingleFile } from '@/utils/files';
import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { LOCATION_TYPES } from '@/constant/location';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '@/helpers/response';
import APIQuery from '@/helpers/apiQuery';
import { NotFoundError } from '@/error/customError';

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.userId;
    const profileData = await User.findById(userId)
        .select(['username', 'email', 'avatar', 'phone', 'role', 'isActive'])
        .lean();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: profileData,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get: getAllUsers
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    const features = new APIQuery(User.find({}).select('-password -avatarRef'), req.query);
    features.filter().sort().limitFields().search().paginate();

    const [data, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / page);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                users: data,
                page: page,
                totalDocs: totalDocs,
                totalPages: totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get: getUserDetails
export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const [user, location] = await Promise.all([
        User.findById(userId).select('-password').lean(),
        Location.findOne({ user: userId }).lean(),
    ]);
    if (!user) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND}/ID: ${userId}`);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: { user, location },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
// @Get: updateUser
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const file = req.file as any;
    const user = await User.findById(userId).select('-password');
    if (!user) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND}/ID: ${userId}`);
    if (file) {
        if (user.avatarRef) await removeUploadedFile(user.avatarRef);
        const { downloadURL, urlRef } = await uploadSingleFile(file, 'files');
        req.body.avatar = downloadURL;
        req.body.avatarRef = urlRef;
    }
    user.set(req.body);
    await user.save();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: user,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
// @Get: createUser
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file as any;
    if (file) {
        const { downloadURL, urlRef } = await uploadSingleFile(file, 'files');
        req.body.avatar = downloadURL;
        req.body.avatarRef = urlRef;
    }
    const user = await User.create(req.body);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: user,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Patch: updateUserProfile
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

// @Patch: Add wishlist
export const addWishList = async (req: Request, res: Response) => {
    const userId = req.userId;
    const productId = req.body.productId;
    const user = await User.findByIdAndUpdate(userId, { $addToSet: { wishList: productId } }, { new: true }).lean();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: user,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
// @Patch: delete wishlist
export const deleteWishList = async (req: Request, res: Response) => {
    const userId = req.userId;
    const productId = req.body.productId;
    const user = await User.findByIdAndUpdate(userId, { $pull: { wishList: productId } }, { new: true }).lean();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: user,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
// @Get: get wishlist by user
export const getWishListByUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    const whislist = await User.findById(userId).select('wishList').populate('wishList').lean();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: whislist,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
