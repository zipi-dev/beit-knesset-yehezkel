export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(',\n');
            return next({ 
                status: 400, 
                type: 'validation error',
                error: { message: errorMessage }
            });
        }
        
        req.body = value; // update the request body
        next();
    };
};