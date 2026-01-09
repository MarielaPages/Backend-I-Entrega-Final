import { Router } from 'express'
import { productManager, Product } from '../managers/classes.js'

const router = Router()

//Peticiones products
router.get('/', async (req, res) => {
    const { page, limit, category, sort } = req.query

    const response = await productManager.getProducts(page, limit, category, sort) // si no le paso nada me devolvera pagina 1 y limite 10 que es lo que seteamos en el metodo de los managers

    const nextPage = response.hasNextPage
        ? `http://localhost:8080/api/products?page=${response.nextPage}`
        : null;
    const prevPage = response.hasPrevPage
        ? `http://localhost:8080/api/products?page=${response.prevPage}`
        : null;
    res.json({
        payload: response.docs,
        info: {
        count: response.totalDocs,
        totalPages: response.totalPages,
        nextLink: nextPage,
        prevLink: prevPage,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        }
    });

})

router.get('/:pid', async(req, res) => {
    
    const {pid} = req.params

    res.send(await productManager.getProductById(pid))

})

router.post('/', async (req, res) => {

    let product = new Product(req.body.title, req.body.description, req.body.price, req.body.code, req.body.stock)

    await productManager.addProduct(product)

    res.send('the product has been saved')

})

router.put('/:pid', async (req, res) => {
    
    const {pid} = req.params

    //modifico el array, quitando el pod con ese id y colocando el nuevo con mismo id
    await productManager.updateById(req.body, pid)

    res.send('the product has been updated')

})

router.delete('/:pid', async (req, res) => {
    
    const {pid} = req.params

    await productManager.deleteById(pid)

    res.send('the product has been deleted')

})


export default router