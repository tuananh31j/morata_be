import config from '@/config/env.config';
import { tokenTypes } from '@/constant/token';
import { BadRequestError, DuplicateError, NotAcceptableError, UnAuthenticatedError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { generateToken, saveToken, verifyToken } from './token.service';
import _ from 'lodash';
import { sendMail } from '@/utils/sendMail';
import Token from '@/models/Token';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ppid } from 'process';

// @Register
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const foundedUser = await User.findOne({ email: req.body.email });
    if (foundedUser) {
        throw new DuplicateError('This email is taken.');
    }

    const newUser = await User.create({ ...req.body });

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newUser,
            success: true,
            status: StatusCodes.CREATED,
            message: ReasonPhrases.CREATED,
        }),
    );
};

// @Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const foundedUser = await User.findOne({ email: req.body.email });
    if (!foundedUser) {
        throw new BadRequestError('Incorrect email or password');
    }

    const isMatchedPassword = await bcrypt.compare(req.body.password, foundedUser?.password);

    if (!isMatchedPassword) {
        throw new BadRequestError('Incorrect email or password');
    }
    if (!foundedUser.isActive) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
            customResponse({
                data: `${foundedUser.email}`,
                message: 'Your account has not been activated yet. We have resent the activation email to your Gmail.',
                status: StatusCodes.NOT_ACCEPTABLE,
                success: false,
            }),
        );
    }

    const user = _.pick(foundedUser, ['_id', 'username', 'email', 'role', 'isActive']);
    return user;
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies;

    if (!cookie.jwt) {
        throw new NotAcceptableError('Not Acceptable: Invalid token refresh.');
    }
    const token = await verifyToken(cookie.jwt, config.jwt.refreshTokenKey, tokenTypes.REFRESH);

    const user = await User.findById(token.userId);
    if (!user) {
        throw new NotAcceptableError('Not Acceptable: Invalid token refresh.');
    }

    const accessToken = generateToken(user, config.jwt.accessTokenKey, config.jwt.accessExpiration);

    return { accessToken };
};

// @Logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies;
    if (!cookie.jwt) {
        throw new NotAcceptableError('Not Acceptable: Invalid Token');
    }
    const token = await verifyToken(cookie.jwt, config.jwt.refreshTokenKey, tokenTypes.REFRESH);
    await token.deleteOne();

    res.clearCookie('jwt', { maxAge: 0, sameSite: 'none', httpOnly: true, secure: true });

    return res
        .status(StatusCodes.RESET_CONTENT)
        .json(customResponse({ data: null, message: 'logged out', success: true, status: StatusCodes.NO_CONTENT }));
};

// @Send Mail Verify account

export const sendMailverifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    const checkedEmail = await User.findOne({ email: req.body.email });
    if (checkedEmail?.isActive) {
        throw new BadRequestError('User is actived');
    }
    if (!checkedEmail) {
        throw new BadRequestError('Not found the user');
    }
    const verifyToken = generateToken(checkedEmail, config.jwt.verifyTokenKey, config.jwt.verifyExpiration);
    await saveToken(verifyToken, checkedEmail._id.toString(), tokenTypes.VERIFY_EMAIL);
    const contentEmail = {
        subject: '[MORATA] - Activate your account',
        content: {
            title: 'Activate Your Account',
            warning: 'If you do not register, you will not be able to use all of our services.',
            description:
                'Thank you for signing up with Morata! To complete your account activation, please click the link below:',
        },
        link: {
            linkName: 'Activate Account',
            linkHerf: `http://localhost:3000/verifyAccount/${verifyToken}?email=${checkedEmail.email}`,
        },
    };
    sendMail({ email: req.body.email, template: contentEmail });
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: 'Please Check Your Email',
            success: true,
            status: StatusCodes.NO_CONTENT,
        }),
    );
};

// Verify Email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || (req.body.token as string);
    jwt.verify(token, config.jwt.verifyTokenKey, async (err: any, decoded: any) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new UnAuthenticatedError('Token has expired.'));
            }
            if (err.name === 'JsonWebTokenError') {
                return next(new UnAuthenticatedError('Invalid token.'));
            }
            return next(new UnAuthenticatedError('Token verification failed.'));
        }
        const { userId } = decoded as JwtPayload;
        await User.findByIdAndUpdate(userId, { isActive: true });
        return res.status(StatusCodes.ACCEPTED).json(
            customResponse({
                data: null,
                status: StatusCodes.ACCEPTED,
                success: true,
                message: 'Your account has been successfully activated.',
            }),
        );
    });
};
export const sendMailForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const checkedEmail = await User.findOne({ email: req.body.email });
    if (!checkedEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json(
            customResponse({
                data: {
                    field: 'email',
                    message: 'This email is not registered',
                },
                message: 'Error Email',
                status: 400,
                success: false,
            }),
        );
    }
    const verifyToken = generateToken(
        checkedEmail,
        config.jwt.resetPasswordTokenKey,
        config.jwt.resetPasswordExpiration,
    );
    await saveToken(verifyToken, checkedEmail._id.toString(), tokenTypes.RESET_PASSWORD);
    const contentEmail = {
        subject: '[MORATA] - Reset your password',
        content: {
            title: 'Reset Your password',
            warning: 'Warning: This link will expire in 5 minutes!',
            description: 'You want to reset your password. Please click the link below to reset your password.',
        },
        link: {
            linkName: 'Reset Password',
            linkHerf: `http://localhost:3000/resetPassword/${verifyToken}?email=${checkedEmail.email}`,
        },
    };
    sendMail({ email: req.body.email, template: contentEmail });
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: 'Please Check Your Email',
            success: true,
            status: StatusCodes.NO_CONTENT,
        }),
    );
};
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || (req.body.token as string);
    jwt.verify(token, config.jwt.resetPasswordTokenKey, async (err: any, decoded: any) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new UnAuthenticatedError('Token has expired.'));
            }
            if (err.name === 'JsonWebTokenError') {
                return next(new UnAuthenticatedError('Invalid token.'));
            }
            return next(new UnAuthenticatedError('Token verification failed.'));
        }
        const { userId } = decoded as JwtPayload;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        return res.status(StatusCodes.ACCEPTED).json(
            customResponse({
                data: null,
                status: StatusCodes.ACCEPTED,
                success: true,
                message: 'Your password has been successfully changed.',
            }),
        );
    });
};
