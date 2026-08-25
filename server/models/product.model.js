import { model, Schema } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true },        
    price: { type: Number, required: true },       
    description: String,                           
    imageUrl: String,                            
    category: String,
    stock: { type: Number, default: 1 }            
});

export const Product = model('products', productSchema);
