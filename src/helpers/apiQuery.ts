import mongoose, { Query, Document } from 'mongoose';

interface QueryString {
    [key: string]: any;
    page?: string;
    sort?: string;
    limit?: string;
    fields?: string;
}

class APIQuery<T extends Document> {
    public query: Query<T[], T>;
    public queryString: QueryString;

    constructor(query: Query<T[], T>, queryString: QueryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter(): APIQuery<T> {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach((el) => delete queryObj[el]);

        if (queryObj.categoryId) {
            queryObj.categoryId = { $in: queryObj.categoryId.split(',') };
        }
        if (queryObj.brandId) {
            queryObj.brandId = { $in: queryObj.brandId.split(',') };
        }
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(): APIQuery<T> {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields(): APIQuery<T> {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }
    search(): APIQuery<T> {
        if (this.queryString.search) {
            const isId = mongoose.Types.ObjectId.isValid(this.queryString.search);
            if (isId) {
                const search = this.queryString.search;
                this.query = this.query.find({ _id: search });
            } else {
                const search = this.queryString.search;
                this.query = this.query.find({ name: { $regex: search, $options: 'i' } });
                console.log(search, ',,,,,,,,,,,,,,,,,,,,,,');
            }
        }
        return this;
    }

    paginate() {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
    async count() {
        const totalDocs = await this.query.model.countDocuments(this.query.getQuery());
        return totalDocs;
    }
}

export default APIQuery;
