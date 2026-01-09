import { Router } from 'express'
import { cartManager } from '../managers/classes.js'

const router = Router()

//Peticiones cart
router.post('/', async (req, res) => {

    await cartManager.createCart(req.body)

    res.send('the cart has been created')

})

router.get('/:cid', async (req, res) => {

    const {cid} = req.params

    let cartById = await cartManager.getCartById(cid)

    res.send(cartById[0].products) //para que muestre los procutos dentro del carrito (el carrito es unico, asi que solo tiene un elemento 0 y ya dentro si estan los productos que es un array)
})

router.post('/:cid/product/:pid', async (req, res) => {

    const {cid, pid} = req.params
    
    const {quantity} = req.body
    
    await cartManager.addProductToCart(cid, pid, parseInt(quantity))  
    
    res.send('the products have been added correctly') 


})

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params

        const products = req.body

        const cart = await cartManager.updateCart(cid, products)
        
        res.json(cart)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params

        const { quantity } = req.body

        const cart = await cartManager.updateProductQuantity(cid, pid, quantity)

        res.json(cart) 

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params

        const cart = await cartManager.deleteProductFromCart(cid, pid)
        
        res.json(cart)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params

        const cart = await cartManager.clearCart(cid)
        
        res.json({ message: "Carrito vaciado", cart })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

export default router