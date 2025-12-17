import mongoose from "mongoose";

const carritosSchema = new mongoose.Schema(
    {
        cartID: {type: mongoose.Schema.Types.ObjectId, required: true},  
        products: [{
            product: {type: mongoose.Schema.Types.ObjectId, required: true}, 
            quantity: {type: Number}
        }] //Entiendo que aca pueden entrar varios objetos con ese formato
    }
)

export const CartModel = mongoose.model("carts", carritosSchema);
