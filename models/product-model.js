import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required:true},
  description: { type: String, required:true},
  price: { type: Number, required:true},
  code: { type: Number, required:true},
  stock: { type: Number, required:true}
});

productSchema.plugin(paginate);

export const ProductModel = mongoose.model("products", productSchema);
