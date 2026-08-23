import { Product } from "../models/product.model.js";

export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

export const addProduct = async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);        
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};


