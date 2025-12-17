import express from 'express'
import handlebars from 'express-handlebars'
import viewsRouter from './routers/views-router.js'
import { Server } from 'socket.io'
import fs from "fs"
import productsRouter from './routers/products-router.js'
import cartsRouter from './routers/carts-router.js'

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

const PORT = 8080

//Levantamos el servidor
const httpServer = app.listen(PORT, () => {
    console.log(`http server listening on port ${PORT}`)
})

httpServer.on('error', error => {
    console.log (`error on server ${error}`)
}) //Manejo de errores

const socketServer = new Server(httpServer)

//Me traigo los productos
let products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'))

//Websocket
socketServer.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`)

    socketServer.emit('array-productos', products)

    //agrego producto
    socket.on('new-product', (product) => {
        if(products.length === 0){
            product.id = 1
        }else{

            product.id = products.sort((a, b) => a.id - b.id)[products.length -1].id + 1
        }
        products.push(product)
        fs.writeFileSync('./products.json', JSON.stringify(products))

        socketServer.emit('array-productos', products)
    })

    //elimino producto
    socket.on("deleteProduct", (id) => {
        products = products.filter(p => p.id !== id);
        fs.writeFileSync("./products.json", JSON.stringify(products));
        socketServer.emit("array-productos", products);
    });
})