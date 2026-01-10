import mongoose from "mongoose";

const carritosSchema = new mongoose.Schema(
    { 
        products: [{
            product: {type: mongoose.Schema.Types.ObjectId, ref: "products", required: true}, 
            quantity: {type: Number, default: 1} // Es buena práctica que por defecto sea 1
        }],//Entiendo que aca pueden entrar varios objetos con ese formato
        default: [], // El array de productos empieza vacío
    }
)

export const CartModel = mongoose.model("carts", carritosSchema);
