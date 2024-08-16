import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Brand from '@/models/Brand';
import Product from '@/models/Product';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get: getAllBrand
export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
    const brands = await Brand.find({}).lean();
    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: brands, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get: getDetailedBrand
export const getDetailedBrand = async (req: Request, res: Response, next: NextFunction) => {
    const brand = await Brand.findById(req.params.id).lean();

    if (!brand) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND}/ID: ${req.params.id}`);
    }

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: brand, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Post: createNewBrand
export const createNewBrand = async (req: Request, res: Response, next: NextFunction) => {
    const brand = await Brand.create({ ...req.body });

    return res
        .status(StatusCodes.CREATED)
        .json(
            customResponse({ data: brand, success: true, status: StatusCodes.CREATED, message: ReasonPhrases.CREATED }),
        );
};

// @Patch: updateBrand
export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
    const brand = await Brand.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

    if (!brand) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} brand with id: ${req.params.id}`);
    }

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: brand, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
