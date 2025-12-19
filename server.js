import express from 'express'
import handlebars from 'express-handlebars'
import viewsRouter from './routers/views-router.js'
import { Server } from 'socket.io'
import productsRouter from './routers/products-router.js'
import cartsRouter from './routers/carts-router.js'
import {initMongoDB} from './config/connection.js'
import { productManager } from './managers/classes.js'

//Creo mi app servidor
const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(`${process.cwd()}/public`))

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', `${process.cwd()}/views`)

app.use('/', viewsRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Inicializo la base de datos de MongoDB
initMongoDB()
    .then(() => console.log('database connected') )
    .catch((err) => console.log(err))

const PORT = 8080

//Levantamos el servidor
const httpServer = app.listen(PORT, () => {
    console.log(`http server listening on port ${PORT}`)
})

httpServer.on('error', error => {
    console.log (`error on server ${error}`)
}) //Manejo de errores

const socketServer = new Server(httpServer)

//Websocket
socketServer.on("connection", async (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`)

    //Envio los productos de la DB
    socketServer.emit('array-productos', await productManager.getProducts())
    
    //agrego producto
    socket.on('new-product', async (product) => {
        
        await productManager.addProduct(product)

        socketServer.emit('array-productos', await productManager.getProducts())
    })

    //elimino producto
    socket.on("deleteProduct", async (id) => {
        
        await productManager.deleteById(id)

        socketServer.emit("array-productos", await productManager.getProducts());
    });
})