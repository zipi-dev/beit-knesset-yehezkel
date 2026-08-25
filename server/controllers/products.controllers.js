import { Product } from "../models/product.model.js";
import { isValidObjectId } from "mongoose";

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
        const existingProduct = await Product.findOne({ name: req.body.name });

        if (existingProduct) {
            existingProduct.stock += (req.body.stock || 1);
            await existingProduct.save();
            return res.status(200).json(existingProduct);
        }
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

export const updateProduct = async (req, res, next) => {
     try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return next({
                error: new Error('product not found'),
                type: 'resource not found error',
                status: 404
            });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: req.body },  
            { new: true, runValidators: true }      
        );
        if (!updatedProduct) {
            return next({
                status: 404,
                error: new Error('Product not found'),
                type: 'resource not found error'
            });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return next({
                error: new Error('product not found'),
                type: 'resource not found error',
                status: 404
            });
        }
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (deletedProduct) {
            return res.status(204).send();
        }
        return next({
            error: new Error('product not found'),
            type: 'resource not found error',
            status: 404
        });
        
    } catch (err) {
        next({ status: 500, error: err, type: 'server error' });
    }
};