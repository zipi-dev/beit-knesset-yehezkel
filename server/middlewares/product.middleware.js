
export const validateProduct = (req, res, next) => {
    const { name, price } = req.body;
    if (name === undefined || name === null || price === undefined || price === null) {
        return next({
            status: 400,
            error: new Error('Product name and price are required fields'),
            type: 'validation error'
        });
    }
    if (typeof name !== 'string' || name.trim() === '') {
        return next({
            status: 400,
            error: new Error('Product name must be a non-empty string'),
            type: 'validation error'
        });
    }
    req.body.name = name.trim();
    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        return next({
            status: 422,
            error: new Error('Price must be a valid number greater than zero'),
            type: 'validation error'
        });
    }
    next();
};