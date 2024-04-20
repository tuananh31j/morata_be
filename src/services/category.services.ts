import { AddCategoryRequestBody, UpdateCategoryRequestBody } from '@/interfaces/category';
import { NotFoundError } from '@/middlewares/errors/customErrors';
import Category from '@/models/Category';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getAllCategories = async (req, res, next) => {};

export const getDetailedCategory = async (req, res, next) => {};

export const createNewCategory = async (req, res, next) => {};

export const updateCategory = async (req, res, next) => {};

export const deleteCategory = async (req, res, next) => {};
