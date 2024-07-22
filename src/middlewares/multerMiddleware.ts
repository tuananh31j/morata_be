import { BadRequestError } from '@/error/customError';
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new BadRequestError('Only JPG, JPEG, and PNG files are allowed!'));
        }
        if (file.size > 3 * 1024 * 1024) {
            return cb(new BadRequestError('File size must be less than 3MB!'));
        }

        cb(null, true);
    },
});

export default upload;
