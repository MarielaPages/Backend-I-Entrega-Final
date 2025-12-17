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

    let cartById = await cartManager.getCartById(parseInt(cid))

    res.send(cartById.products)
})

router.post('/:cid/product/:pid', async (req, res) => {

    const {cid, pid} = req.params
    
    const {quantity} = req.body
    
    await cartManager.addProductToCart(parseInt(cid), parseInt(pid), parseInt(quantity))  
    
    res.send('the products have been added correctly') 


})

export default router