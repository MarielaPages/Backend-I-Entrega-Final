import { ProductModel } from "../models/product-model.js"
import { CartModel } from "../models/cart-model.js"

export class Product{
    constructor(title, description, price, code, stock){
        this.title = title
        this.description = description
        this.price = price
        this.code = code
        this.stock = stock
    }
}

export class ProductManager{
    constructor(model){
        this.model = model
    }
    async addProduct(product){
        try{

            //leo los datos guardados en el archivo
            let productsArray = await this.model.find({})

            //chequeo que no exista el producto con el mismo codigo
            let codeObjectExists = productsArray.find(item => item.code === product.code)
            if(codeObjectExists === undefined){

                return await this.model.create(product)
            
            }else{
                return 'the code for this product already exists'
            }

        }catch(err){
            throw err
        }
        
    }

    async getProducts(){
        try{
            return await this.model.find({}) 
        }catch(err){
            throw err
        }
    }
    
    async getProductById(id){
        try{

            return await this.model.find({_id:id}) //devuelve array con el objeto encontrado en formato js

        }catch(err){
            throw err
        }
    }

    async updateById(newProduct, id){
        try{

           return await this.model.findByIdAndUpdate(id, newProduct, { new: true })

        }catch(err){
            throw err
        }
    }
    async deleteById(id){

        try{

            return await this.model.findByIdAndDelete({_id:id})

        }catch(err){
            throw err
        }

    }
}

export class CartManager{
    constructor(model){
        this.model = model
    }

    async createCart(products){
          try{

            //Creo un objeto con los productos pasados que hara referencia al carrito
            let cart = {products: products || []} //la idea es que products sera el array the productos a poner en el carrito

            return await this.model.create(cart)
            
        }catch(err){
            throw err
        }
    }

    async getAllCarts(){
        try{
            
            return await this.model.find({}) 

        }catch(err){
            throw err
        }
    }

    async getCartById(id){
        try{

            return await this.model.find({_id:id})

        }catch(err){
            throw err
        }
    }

    async addProductToCart(cid, pid, quantity){

        try{


            //leo los datos guardados en la db
            let cartsArray = await this.model.find({}) 

            //busco el carrito correspondiente al id pasado
            let foundCart = cartsArray.find(item => item.id === cid)

            //Dentro de products en cart busco el producto con el id pasado y si no existe, lo creo
            let foundProduct = foundCart.products.find(item => item.product === pid)
            
            //incializo una variable donde iran todos los productos del carrito correspondiente
            let productsForNewQuantityInIdProduct

            if(foundProduct !== undefined){
                foundProduct.quantity = foundProduct.quantity + quantity

                //la idea es que el objeto tiene la forma {product: id, quantity: quantity}

                //Quito el producto para volver a guardarlo con su nueva cantidad
                productsForNewQuantityInIdProduct = foundCart.products.filter(item => item.product !== pid)

                productsForNewQuantityInIdProduct.push(foundProduct)

            }else{
                let newProductIfUndefined = {}
                newProductIfUndefined.quantity = quantity 
                newProductIfUndefined.product = pid

                //Guardo el nuevo producto con su cantidad en la seccion de productos del carrito correspondiente
                productsForNewQuantityInIdProduct = foundCart.products
                productsForNewQuantityInIdProduct.push(newProductIfUndefined)
            }

            let obj = {products: productsForNewQuantityInIdProduct, id:cid}

            await this.model.findByIdAndUpdate(cid, obj, { new: true })
            
        }catch(err){
            throw err
        }


    }

}

export const productManager = new ProductManager(ProductModel);
export const cartManager = new CartManager(CartModel)