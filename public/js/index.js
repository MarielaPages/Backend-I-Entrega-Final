const socket = io()

const form = document.getElementById('form')
const inputName = document.getElementById('title')
const inputPrice = document.getElementById('price')
const inputDescription = document.getElementById('description')
const inputCode = document.getElementById('code')
const inputStock = document.getElementById('stock')
const inputCategory = document.getElementById('category')
const deleteForm = document.getElementById('deleteForm')
const deleteId = document.getElementById('deleteId')
const products = document.getElementById('products')


form.onsubmit = (e) => {
    e.preventDefault();

    const title = inputName.value.trim()
    const price = inputPrice.value
    const description = inputDescription.value.trim()
    const code = inputCode.value
    const stock = inputStock.value
    const category = inputCategory.value

    socket.emit('new-product', {title, price, description, code, stock, category})
}

socket.on('array-productos', (arrayProducts) => {
    let infoProducts = ''

    arrayProducts.forEach(p => {
        infoProducts += `Title: ${p.title} - Price: $${p.price} <br/>`
    })

    products.innerHTML = infoProducts
})

deleteForm.onsubmit = (e) => {
    e.preventDefault();

    const id = deleteId.value.trim();
    socket.emit("deleteProduct", id);
}