import { Router } from 'express'
import { productManager, Product } from '../managers/classes.js'

const router = Router()

//Peticiones products
router.get('/', async (req, res) => {

    res.send(await productManager.getProducts())

})

router.get('/:pid', async(req, res) => {
    
    const {pid} = req.params

    res.send(await productManager.getProductById(parseInt(pid)))

})

router.post('/', async (req, res) => {

    let product = new Product(req.body.title, req.body.description, req.body.price, req.body.code, req.body.stock)

    await productManager.addProduct(product)

    res.send('the product has been saved')

})

router.put('/:pid', async (req, res) => {
    
    const {pid} = req.params

    //modifico el array, quitando el pod con ese id y colocando el nuevo con mismo id
    await productManager.updateById(req.body, parseInt(pid))

    res.send('the product has been updated')

})

router.delete('/:pid', async (req, res) => {
    
    const {pid} = req.params

    await productManager.deleteById(parseInt(pid))

    res.send('the product has been deleted')

})


export default router