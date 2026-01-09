import mongoose from "mongoose";

const carritosSchema = new mongoose.Schema(
    { 
        products: [{
            product: {type: mongoose.Schema.Types.ObjectId, ref: "products", default: [], required: true}, 
            quantity: {type: Number}
        }] //Entiendo que aca pueden entrar varios objetos con ese formato
    }
)

export const CartModel = mongoose.model("carts", carritosSchema);
