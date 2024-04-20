export interface Category {
  name: string;
  description: string;
}

export interface AddCategoryRequestBody extends Category {}

export interface UpdateCategoryRequestBody extends Category {}
