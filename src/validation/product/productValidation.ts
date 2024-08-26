import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';
import { BadRequestError } from '@/error/customError';
import productSchema from './productSchema';

export const addProductValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { brandId, isHide, categoryId, name, description } = req.body;

    if (!req.body.variationsString) {
        return next(new BadRequestError('Vui lòng điền thông tin biến thể sản phẩm!' + req.body.name));
    }
    if (!req.body.attributes) {
        return next(new BadRequestError('Thuộc tính sản phẩm không được để trống!'));
    }

    let variationsStringRaw = req.body.variationsString;
    if (typeof variationsStringRaw === 'string') {
        try {
            variationsStringRaw = JSON.parse(variationsStringRaw);
        } catch (error) {
            console.error('Error parsing variationsString:', error);
            return next(new BadRequestError('Chuỗi JSON cho variationsString không hợp lệ!'));
        }
    }

    let attributesRaw = req.body.attributes;
    if (typeof attributesRaw === 'string') {
        try {
            attributesRaw = JSON.parse(attributesRaw);
        } catch (error) {
            console.error('Error parsing attributes:', error);
            return next(new BadRequestError('Chuỗi JSON cho attributes không hợp lệ!'));
        }
    }

    const variationsString = variationsStringRaw.map((item: any) => ({
        imageUrlRef: item.imageUrlRef,
        price: item.price,
        stock: item.stock,
        isActive: !!item.isActive,
        variantAttributes: item.variantAttributes.map((attribute: any) => ({
            key: attribute.key,
            name: attribute.name,
            value: attribute.value,
        })),
    }));

    const attributes = attributesRaw.map((item: any) => ({
        key: item.key,
        name: item.name,
        value: item.value,
    }));

    req.body = { brandId, isHide, categoryId, name, description, variationsString, attributes };

    return validator(
        productSchema.createProduct,
        { brandId, categoryId, name, description, variationsString, attributes, isHide },
        next,
    );
};

// update product validation
export const updateProductValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { brandId, isHide, categoryId, name, description } = req.body;

    if (!req.body.attributes) {
        return next(new BadRequestError('Thuộc tính sản phẩm không được để trống!'));
    }

    let attributeVariantForFilter = req.body.attributeVariantForFilter;
    if (typeof attributeVariantForFilter === 'string') {
        try {
            attributeVariantForFilter = JSON.parse(attributeVariantForFilter);
        } catch (error) {
            console.error('Error parsing attributes:', error);
            attributeVariantForFilter = [];
        }
    }
    let attributesRaw = req.body.attributes;
    if (typeof attributesRaw === 'string') {
        try {
            attributesRaw = JSON.parse(attributesRaw);
        } catch (error) {
            console.error('Error parsing attributes:', error);
            return next(new BadRequestError('Chuỗi JSON cho attributes không hợp lệ!'));
        }
    }
    let oldImageRefs: any = [];
    if (typeof req.body.oldImageRefs === 'string') {
        try {
            oldImageRefs = JSON.parse(req.body.oldImageRefs);
        } catch (error) {
            console.error('Error parsing attributes:', error);
            return next(new BadRequestError('Chuỗi JSON cho oldImageRefs không hợp lệ!'));
        }
    }
    let oldImages: any = [];
    if (typeof req.body.oldImages === 'string') {
        try {
            oldImages = JSON.parse(req.body.oldImages);
        } catch (error) {
            console.error('Error parsing attributes:', error);
            return next(new BadRequestError('Chuỗi JSON cho oldImages không hợp lệ!'));
        }
    }
    const attributes = attributesRaw.map((item: any) => ({
        key: item.key,
        name: item.name,
        value: item.value,
    }));

    req.body = {
        brandId,
        isHide,
        categoryId,
        name,
        description,
        attributes,
        oldImages,
        oldImageRefs,
        attributeVariantForFilter,
    };

    return validator(
        productSchema.updateProduct,
        { brandId, categoryId, name, description, attributes, isHide, oldImages, oldImageRefs },
        next,
    );
};
