import { Router } from 'express'
import { productManager } from '../managers/classes.js'

const router = Router()

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();

    const plainProducts = JSON.parse(JSON.stringify(products))
    
    res.render('home', { plainProducts });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
})

export default router