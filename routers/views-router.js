import { Router } from 'express'
import { productManager } from '../managers/classes.js'

const router = Router()

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();

    const plainProducts = JSON.parse(JSON.stringify(products)) // No logro usar el lean en las clases para hacer this.model.find({}).lean() y que ya me de el plain object y no tener que hacer esto
    
    res.render('home', { plainProducts });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
})

export default router