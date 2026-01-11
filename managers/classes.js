import { ProductModel } from "../models/product-model.js"
import { CartModel } from "../models/cart-model.js"

export class Product{
    constructor(title, description, price, code, stock, category){
        this.title = title
        this.description = description
        this.price = price
        this.code = code
        this.stock = stock
        this.category = category
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

    async getProducts(page=1, limit=10, category, sort){
        try{

            const filter = category ? { category: category } : {}

            let sortOrder = {}

            if(sort) sortOrder.price = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null

            return await this.model.paginate(filter, {page, limit, sort: sortOrder, lean:true}) 
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

            return await this.model.find({_id:id}).populate("products.product").lean()

        }catch(err){
            throw err
        }
    }

    async addProductToCart(cid, pid, quantity){

        try{ 

            //busco el carrito correspondiente al id pasado
            const foundCart = await this.model.findById(cid)
            if (!foundCart) throw new Error("Carrito no encontrado")

            //Dentro de products en cart busco el producto con el id pasado y si no existe, lo creo
            let foundProduct = foundCart.products.find(item => item.product.toString() === pid)
            
            if (foundProduct) {
                foundProduct.quantity += quantity
            } else {
                foundCart.products.push({
                    product: pid,
                    quantity
                })
            }

            await foundCart.save()
            return foundCart
            
        }catch(err){
            throw err
        }

    }

    async updateCart(cid, products) {
        try {
            return await this.model.findByIdAndUpdate(
                cid,
                { products },
                { new: true }
            )
        } catch (error) {
            throw error
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await this.model.findById(cid)
            if (!cart) throw new Error("Carrito no encontrado")

            const product = cart.products.find(
                p => p.product.toString() === pid
            )

            if (!product) throw new Error("Producto no encontrado")

            product.quantity = quantity
            await cart.save()

            return cart
        } catch (error) {
            throw error
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await this.model.findById(cid)
            if (!cart) throw new Error("Carrito no encontrado")

            cart.products = cart.products.filter(
                p => p.product.toString() !== pid
            )

            await cart.save()
            return cart
        } catch (error) {
            throw error
        }
    }

    async clearCart(cid) {
        try {
            return await this.model.findByIdAndUpdate(
                cid,
                { products: [] },
                { new: true }
            )
        } catch (error) {
            throw error
        }
    }

}

export const productManager = new ProductManager(ProductModel);
export const cartManager = new CartManager(CartModel)